const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const sharp = require('sharp');
const crypto = require('crypto');
const { app } = require('electron');

/**
 * Manages film posters including downloading, storing, resizing, and caching
 */
class PosterManager {
  constructor() {
    // Define paths for storing posters
    this.postersDir = path.join(app.getPath('userData'), 'posters');
    this.originalDir = path.join(this.postersDir, 'original');
    this.thumbnailDir = path.join(this.postersDir, 'thumbnail');
    this.cacheDir = path.join(this.postersDir, 'cache');
    
    // Create directories if they don't exist
    this._ensureDirectories();
    
    // Cache for in-memory poster paths
    this.pathCache = new Map();
  }
  
  /**
   * Ensure all required directories exist
   * @private
   */
  _ensureDirectories() {
    [this.postersDir, this.originalDir, this.thumbnailDir, this.cacheDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }
  
  /**
   * Generate a unique filename for a poster based on its URL or content
   * @param {string} urlOrPath - URL or file path
   * @param {Buffer} [data] - File data (optional)
   * @returns {string} Unique filename
   * @private
   */
  _generateFilename(urlOrPath, data) {
    // If data is provided, hash the data
    if (data) {
      return crypto.createHash('md5').update(data).digest('hex') + '.jpg';
    }
    
    // Otherwise, hash the URL or path
    return crypto.createHash('md5').update(urlOrPath).digest('hex') + '.jpg';
  }
  
  /**
   * Download an image from a URL
   * @param {string} url - Image URL
   * @returns {Promise<Buffer>} Image data
   * @private
   */
  _downloadImage(url) {
    return new Promise((resolve, reject) => {
      // Choose http or https based on URL
      const client = url.startsWith('https') ? https : http;
      
      client.get(url, (response) => {
        // Handle redirects
        if (response.statusCode === 301 || response.statusCode === 302) {
          return resolve(this._downloadImage(response.headers.location));
        }
        
        // Check for successful response
        if (response.statusCode !== 200) {
          return reject(new Error(`Failed to download image: ${response.statusCode}`));
        }
        
        // Collect data chunks
        const chunks = [];
        response.on('data', chunk => chunks.push(chunk));
        response.on('end', () => resolve(Buffer.concat(chunks)));
        response.on('error', err => reject(err));
      }).on('error', err => reject(err));
    });
  }
  
  /**
   * Save image data to a file
   * @param {Buffer} data - Image data
   * @param {string} filePath - Path to save the file
   * @returns {Promise<void>}
   * @private
   */
  _saveImage(data, filePath) {
    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, data, err => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
  
  /**
   * Create a thumbnail from an image
   * @param {Buffer|string} input - Image data or path to image
   * @param {string} outputPath - Path to save the thumbnail
   * @param {Object} [options] - Thumbnail options
   * @param {number} [options.width=200] - Thumbnail width
   * @param {number} [options.height=300] - Thumbnail height
   * @param {boolean} [options.fit=true] - Whether to maintain aspect ratio
   * @returns {Promise<void>}
   * @private
   */
  async _createThumbnail(input, outputPath, options = {}) {
    const { width = 200, height = 300, fit = true } = options;
    
    try {
      // Create a sharp instance from input
      const image = typeof input === 'string' ? sharp(input) : sharp(input);
      
      // Resize the image
      const resizeOptions = {
        width,
        height,
        fit: fit ? 'inside' : 'fill',
        withoutEnlargement: true
      };
      
      // Process and save the image
      await image
        .resize(resizeOptions)
        .jpeg({ quality: 80 })
        .toFile(outputPath);
    } catch (error) {
      console.error('Error creating thumbnail:', error);
      throw error;
    }
  }
  
  /**
   * Download and store a poster from a URL
   * @param {string} url - Poster URL
   * @param {Object} [options] - Options
   * @param {boolean} [options.createThumbnail=true] - Whether to create a thumbnail
   * @param {number} [options.width=200] - Thumbnail width
   * @param {number} [options.height=300] - Thumbnail height
   * @returns {Promise<Object>} Paths to the original and thumbnail images
   */
  async downloadPoster(url, options = {}) {
    const { createThumbnail = true, width = 200, height = 300 } = options;
    
    try {
      // Check if URL is already in cache
      const cacheKey = `download:${url}`;
      if (this.pathCache.has(cacheKey)) {
        return this.pathCache.get(cacheKey);
      }
      
      // Download the image
      const imageData = await this._downloadImage(url);
      
      // Generate a unique filename
      const filename = this._generateFilename(url, imageData);
      const originalPath = path.join(this.originalDir, filename);
      
      // Save the original image
      await this._saveImage(imageData, originalPath);
      
      // Create a thumbnail if requested
      let thumbnailPath = null;
      if (createThumbnail) {
        thumbnailPath = path.join(this.thumbnailDir, filename);
        await this._createThumbnail(imageData, thumbnailPath, { width, height });
      }
      
      // Create result object
      const result = {
        original: originalPath,
        thumbnail: thumbnailPath,
        filename
      };
      
      // Cache the result
      this.pathCache.set(cacheKey, result);
      
      return result;
    } catch (error) {
      console.error('Error downloading poster:', error);
      throw error;
    }
  }
  
  /**
   * Store a poster from a local file
   * @param {string} filePath - Path to the local file
   * @param {Object} [options] - Options
   * @param {boolean} [options.createThumbnail=true] - Whether to create a thumbnail
   * @param {number} [options.width=200] - Thumbnail width
   * @param {number} [options.height=300] - Thumbnail height
   * @returns {Promise<Object>} Paths to the original and thumbnail images
   */
  async storePoster(filePath, options = {}) {
    const { createThumbnail = true, width = 200, height = 300 } = options;
    
    try {
      // Check if file path is already in cache
      const cacheKey = `store:${filePath}`;
      if (this.pathCache.has(cacheKey)) {
        return this.pathCache.get(cacheKey);
      }
      
      // Read the file
      const imageData = await fs.promises.readFile(filePath);
      
      // Generate a unique filename
      const filename = this._generateFilename(filePath, imageData);
      const originalPath = path.join(this.originalDir, filename);
      
      // Save the original image
      await this._saveImage(imageData, originalPath);
      
      // Create a thumbnail if requested
      let thumbnailPath = null;
      if (createThumbnail) {
        thumbnailPath = path.join(this.thumbnailDir, filename);
        await this._createThumbnail(imageData, thumbnailPath, { width, height });
      }
      
      // Create result object
      const result = {
        original: originalPath,
        thumbnail: thumbnailPath,
        filename
      };
      
      // Cache the result
      this.pathCache.set(cacheKey, result);
      
      return result;
    } catch (error) {
      console.error('Error storing poster:', error);
      throw error;
    }
  }
  
  /**
   * Get a poster by filename
   * @param {string} filename - Poster filename
   * @param {string} [size='original'] - Size ('original' or 'thumbnail')
   * @returns {string|null} Path to the poster or null if not found
   */
  getPosterPath(filename, size = 'original') {
    const dir = size === 'thumbnail' ? this.thumbnailDir : this.originalDir;
    const filePath = path.join(dir, filename);
    
    if (fs.existsSync(filePath)) {
      return filePath;
    }
    
    return null;
  }
  
  /**
   * Delete a poster
   * @param {string} filename - Poster filename
   * @returns {Promise<boolean>} True if successful
   */
  async deletePoster(filename) {
    try {
      const originalPath = path.join(this.originalDir, filename);
      const thumbnailPath = path.join(this.thumbnailDir, filename);
      
      // Delete original if it exists
      if (fs.existsSync(originalPath)) {
        await fs.promises.unlink(originalPath);
      }
      
      // Delete thumbnail if it exists
      if (fs.existsSync(thumbnailPath)) {
        await fs.promises.unlink(thumbnailPath);
      }
      
      // Remove from cache
      for (const [key, value] of this.pathCache.entries()) {
        if (value.filename === filename) {
          this.pathCache.delete(key);
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting poster:', error);
      return false;
    }
  }
  
  /**
   * Resize a poster
   * @param {string} filename - Poster filename
   * @param {Object} options - Resize options
   * @param {number} options.width - Width
   * @param {number} options.height - Height
   * @param {boolean} [options.fit=true] - Whether to maintain aspect ratio
   * @returns {Promise<string>} Path to the resized image
   */
  async resizePoster(filename, options) {
    const { width, height, fit = true } = options;
    
    try {
      // Generate a cache key
      const cacheKey = `resize:${filename}:${width}x${height}:${fit}`;
      
      // Check if already in cache
      if (this.pathCache.has(cacheKey)) {
        return this.pathCache.get(cacheKey);
      }
      
      // Get the original image path
      const originalPath = path.join(this.originalDir, filename);
      if (!fs.existsSync(originalPath)) {
        throw new Error(`Original poster not found: ${filename}`);
      }
      
      // Generate a unique filename for the resized image
      const resizedFilename = `${path.parse(filename).name}_${width}x${height}.jpg`;
      const resizedPath = path.join(this.cacheDir, resizedFilename);
      
      // Create the resized image
      await this._createThumbnail(originalPath, resizedPath, { width, height, fit });
      
      // Cache the result
      this.pathCache.set(cacheKey, resizedPath);
      
      return resizedPath;
    } catch (error) {
      console.error('Error resizing poster:', error);
      throw error;
    }
  }
  
  /**
   * Clear the cache
   * @returns {Promise<boolean>} True if successful
   */
  async clearCache() {
    try {
      // Clear the path cache
      this.pathCache.clear();
      
      // Delete all files in the cache directory
      const files = await fs.promises.readdir(this.cacheDir);
      for (const file of files) {
        await fs.promises.unlink(path.join(this.cacheDir, file));
      }
      
      return true;
    } catch (error) {
      console.error('Error clearing cache:', error);
      return false;
    }
  }
}

// Export a singleton instance
const posterManager = new PosterManager();
module.exports = posterManager;