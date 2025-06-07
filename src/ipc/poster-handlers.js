const { ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const posterManager = require('../utils/posters/poster-manager');

/**
 * Register IPC handlers for poster management
 */
function registerPosterHandlers() {
  /**
   * Download a poster from a URL
   * Channel: poster:download
   * @param {Object} event - IPC event
   * @param {string} url - Poster URL
   * @param {Object} [options] - Download options
   * @returns {Promise<Object>} Poster information
   */
  ipcMain.handle('poster:download', async (event, url, options = {}) => {
    try {
      const result = await posterManager.downloadPoster(url, options);
      
      // Return a simplified result with relative paths for security
      return {
        filename: result.filename,
        original: result.original ? true : false,
        thumbnail: result.thumbnail ? true : false
      };
    } catch (error) {
      console.error('IPC poster:download error:', error);
      throw error;
    }
  });

  /**
   * Store a poster from a local file
   * Channel: poster:store
   * @param {Object} event - IPC event
   * @param {string} filePath - Path to the local file
   * @param {Object} [options] - Store options
   * @returns {Promise<Object>} Poster information
   */
  ipcMain.handle('poster:store', async (event, filePath, options = {}) => {
    try {
      // Validate the file path for security
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }
      
      const result = await posterManager.storePoster(filePath, options);
      
      // Return a simplified result with relative paths for security
      return {
        filename: result.filename,
        original: result.original ? true : false,
        thumbnail: result.thumbnail ? true : false
      };
    } catch (error) {
      console.error('IPC poster:store error:', error);
      throw error;
    }
  });

  /**
   * Get a poster by filename
   * Channel: poster:get
   * @param {Object} event - IPC event
   * @param {string} filename - Poster filename
   * @param {string} [size='original'] - Size ('original' or 'thumbnail')
   * @returns {Promise<string>} Data URL of the poster
   */
  ipcMain.handle('poster:get', async (event, filename, size = 'original') => {
    try {
      const posterPath = posterManager.getPosterPath(filename, size);
      
      if (!posterPath) {
        throw new Error(`Poster not found: ${filename}`);
      }
      
      // Read the file and convert to data URL for security
      const data = await fs.promises.readFile(posterPath);
      const base64 = data.toString('base64');
      const mimeType = 'image/jpeg';
      
      return `data:${mimeType};base64,${base64}`;
    } catch (error) {
      console.error('IPC poster:get error:', error);
      throw error;
    }
  });

  /**
   * Resize a poster
   * Channel: poster:resize
   * @param {Object} event - IPC event
   * @param {string} filename - Poster filename
   * @param {Object} options - Resize options
   * @returns {Promise<string>} Data URL of the resized poster
   */
  ipcMain.handle('poster:resize', async (event, filename, options) => {
    try {
      const resizedPath = await posterManager.resizePoster(filename, options);
      
      // Read the file and convert to data URL for security
      const data = await fs.promises.readFile(resizedPath);
      const base64 = data.toString('base64');
      const mimeType = 'image/jpeg';
      
      return `data:${mimeType};base64,${base64}`;
    } catch (error) {
      console.error('IPC poster:resize error:', error);
      throw error;
    }
  });

  /**
   * Delete a poster
   * Channel: poster:delete
   * @param {Object} event - IPC event
   * @param {string} filename - Poster filename
   * @returns {Promise<boolean>} True if successful
   */
  ipcMain.handle('poster:delete', async (event, filename) => {
    try {
      return await posterManager.deletePoster(filename);
    } catch (error) {
      console.error('IPC poster:delete error:', error);
      throw error;
    }
  });

  /**
   * Clear the poster cache
   * Channel: poster:clearCache
   * @param {Object} event - IPC event
   * @returns {Promise<boolean>} True if successful
   */
  ipcMain.handle('poster:clearCache', async (event) => {
    try {
      return await posterManager.clearCache();
    } catch (error) {
      console.error('IPC poster:clearCache error:', error);
      throw error;
    }
  });

  console.log('Poster IPC handlers registered');
}

module.exports = { registerPosterHandlers };