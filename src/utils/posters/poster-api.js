/**
 * Utility functions for interacting with the poster management IPC channels
 */
import React from 'react';

/**
 * Download a poster from a URL
 * @param {string} url - Poster URL
 * @param {Object} [options] - Download options
 * @param {boolean} [options.createThumbnail=true] - Whether to create a thumbnail
 * @param {number} [options.width=200] - Thumbnail width
 * @param {number} [options.height=300] - Thumbnail height
 * @returns {Promise<Object>} Poster information
 */
export const downloadPoster = async (url, options = {}) => {
  return window.api.invoke('poster:download', url, options);
};

/**
 * Store a poster from a local file
 * @param {string} filePath - Path to the local file
 * @param {Object} [options] - Store options
 * @param {boolean} [options.createThumbnail=true] - Whether to create a thumbnail
 * @param {number} [options.width=200] - Thumbnail width
 * @param {number} [options.height=300] - Thumbnail height
 * @returns {Promise<Object>} Poster information
 */
export const storePoster = async (filePath, options = {}) => {
  return window.api.invoke('poster:store', filePath, options);
};

/**
 * Get a poster by filename
 * @param {string} filename - Poster filename
 * @param {string} [size='original'] - Size ('original' or 'thumbnail')
 * @returns {Promise<string>} Data URL of the poster
 */
export const getPoster = async (filename, size = 'original') => {
  return window.api.invoke('poster:get', filename, size);
};

/**
 * Resize a poster
 * @param {string} filename - Poster filename
 * @param {Object} options - Resize options
 * @param {number} options.width - Width
 * @param {number} options.height - Height
 * @param {boolean} [options.fit=true] - Whether to maintain aspect ratio
 * @returns {Promise<string>} Data URL of the resized poster
 */
export const resizePoster = async (filename, options) => {
  return window.api.invoke('poster:resize', filename, options);
};

/**
 * Delete a poster
 * @param {string} filename - Poster filename
 * @returns {Promise<boolean>} True if successful
 */
export const deletePoster = async (filename) => {
  return window.api.invoke('poster:delete', filename);
};

/**
 * Clear the poster cache
 * @returns {Promise<boolean>} True if successful
 */
export const clearPosterCache = async () => {
  return window.api.invoke('poster:clearCache');
};

/**
 * Create a poster component
 * @param {string} filename - Poster filename
 * @param {string} [size='original'] - Size ('original' or 'thumbnail')
 * @param {Object} [props] - Additional props for the img element
 * @returns {JSX.Element} Image element with poster
 */
export const PosterImage = ({ filename, size = 'original', ...props }) => {
  const [src, setSrc] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    let isMounted = true;

    const loadPoster = async () => {
      try {
        setLoading(true);
        const dataUrl = await getPoster(filename, size);
        if (isMounted) {
          setSrc(dataUrl);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    if (filename) {
      loadPoster();
    } else {
      setSrc(null);
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [filename, size]);

  if (loading) {
    return <div className="poster-loading">Loading...</div>;
  }

  if (error) {
    return <div className="poster-error">Error: {error}</div>;
  }

  if (!src) {
    return <div className="poster-placeholder">No poster</div>;
  }

  return <img src={src} alt="Poster" className="poster-image" {...props} />;
};

// Export all functions
export default {
  downloadPoster,
  storePoster,
  getPoster,
  resizePoster,
  deletePoster,
  clearPosterCache,
  PosterImage
};
