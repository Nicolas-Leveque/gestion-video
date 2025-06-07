/**
 * Utility functions for interacting with the database through IPC
 */

/**
 * Film operations
 */
export const FilmAPI = {
  /**
   * Get a film by ID
   * @param {number} id - Film ID
   * @returns {Promise<Object>} Film with its categories and exemplaires
   */
  getFilm: async (id) => {
    return window.api.invoke('film:get', id);
  },

  /**
   * Get all films
   * @param {Object} [options] - Query options
   * @returns {Promise<Object[]>} Array of films
   */
  getAllFilms: async (options = {}) => {
    return window.api.invoke('film:getAll', options);
  },

  /**
   * Search for films
   * @param {Object} criteria - Search criteria
   * @returns {Promise<Object[]>} Array of matching films
   */
  searchFilms: async (criteria = {}) => {
    return window.api.invoke('film:search', criteria);
  },

  /**
   * Create a new film
   * @param {Object} filmData - Film data
   * @returns {Promise<Object>} Created film
   */
  createFilm: async (filmData) => {
    return window.api.invoke('film:create', filmData);
  },

  /**
   * Update a film
   * @param {number} id - Film ID
   * @param {Object} filmData - Updated film data
   * @returns {Promise<Object>} Updated film
   */
  updateFilm: async (id, filmData) => {
    return window.api.invoke('film:update', id, filmData);
  },

  /**
   * Delete a film
   * @param {number} id - Film ID
   * @returns {Promise<boolean>} True if successful
   */
  deleteFilm: async (id) => {
    return window.api.invoke('film:delete', id);
  }
};

/**
 * Category operations
 */
export const CategoryAPI = {
  /**
   * Get a category by ID
   * @param {number} id - Category ID
   * @param {boolean} [includeFilms=false] - Whether to include associated films
   * @returns {Promise<Object>} Category
   */
  getCategory: async (id, includeFilms = false) => {
    return window.api.invoke('category:get', id, includeFilms);
  },

  /**
   * Get all categories
   * @param {boolean} [includeFilms=false] - Whether to include associated films
   * @returns {Promise<Object[]>} Array of categories
   */
  getAllCategories: async (includeFilms = false) => {
    return window.api.invoke('category:getAll', includeFilms);
  },

  /**
   * Get categories with film count
   * @returns {Promise<Object[]>} Array of categories with film count
   */
  getCategoriesWithFilmCount: async () => {
    return window.api.invoke('category:getWithFilmCount');
  },

  /**
   * Create a new category
   * @param {Object} categoryData - Category data
   * @returns {Promise<Object>} Created category
   */
  createCategory: async (categoryData) => {
    return window.api.invoke('category:create', categoryData);
  },

  /**
   * Update a category
   * @param {number} id - Category ID
   * @param {Object} categoryData - Updated category data
   * @returns {Promise<Object>} Updated category
   */
  updateCategory: async (id, categoryData) => {
    return window.api.invoke('category:update', id, categoryData);
  },

  /**
   * Delete a category
   * @param {number} id - Category ID
   * @returns {Promise<boolean>} True if successful
   */
  deleteCategory: async (id) => {
    return window.api.invoke('category:delete', id);
  }
};

/**
 * Format operations
 */
export const FormatAPI = {
  /**
   * Get a format by ID
   * @param {number} id - Format ID
   * @param {boolean} [includeExemplaires=false] - Whether to include associated exemplaires
   * @returns {Promise<Object>} Format
   */
  getFormat: async (id, includeExemplaires = false) => {
    return window.api.invoke('format:get', id, includeExemplaires);
  },

  /**
   * Get all formats
   * @param {boolean} [includeExemplaires=false] - Whether to include associated exemplaires
   * @returns {Promise<Object[]>} Array of formats
   */
  getAllFormats: async (includeExemplaires = false) => {
    return window.api.invoke('format:getAll', includeExemplaires);
  },

  /**
   * Get formats with exemplaire count
   * @returns {Promise<Object[]>} Array of formats with exemplaire count
   */
  getFormatsWithExemplaireCount: async () => {
    return window.api.invoke('format:getWithExemplaireCount');
  },

  /**
   * Create a new format
   * @param {Object} formatData - Format data
   * @returns {Promise<Object>} Created format
   */
  createFormat: async (formatData) => {
    return window.api.invoke('format:create', formatData);
  },

  /**
   * Update a format
   * @param {number} id - Format ID
   * @param {Object} formatData - Updated format data
   * @returns {Promise<Object>} Updated format
   */
  updateFormat: async (id, formatData) => {
    return window.api.invoke('format:update', id, formatData);
  },

  /**
   * Delete a format
   * @param {number} id - Format ID
   * @returns {Promise<boolean>} True if successful
   */
  deleteFormat: async (id) => {
    return window.api.invoke('format:delete', id);
  }
};

/**
 * Exemplaire operations
 */
export const ExemplaireAPI = {
  /**
   * Get an exemplaire by ID
   * @param {number} id - Exemplaire ID
   * @returns {Promise<Object>} Exemplaire with film and format
   */
  getExemplaire: async (id) => {
    return window.api.invoke('exemplaire:get', id);
  },

  /**
   * Get all exemplaires
   * @param {Object} [options] - Query options
   * @returns {Promise<Object[]>} Array of exemplaires
   */
  getAllExemplaires: async (options = {}) => {
    return window.api.invoke('exemplaire:getAll', options);
  },

  /**
   * Get exemplaires by film ID
   * @param {number} filmId - Film ID
   * @returns {Promise<Object[]>} Array of exemplaires
   */
  getExemplairesByFilm: async (filmId) => {
    return window.api.invoke('exemplaire:getByFilm', filmId);
  },

  /**
   * Get exemplaires by format ID
   * @param {number} formatId - Format ID
   * @returns {Promise<Object[]>} Array of exemplaires
   */
  getExemplairesByFormat: async (formatId) => {
    return window.api.invoke('exemplaire:getByFormat', formatId);
  },

  /**
   * Create a new exemplaire
   * @param {Object} exemplaireData - Exemplaire data
   * @returns {Promise<Object>} Created exemplaire
   */
  createExemplaire: async (exemplaireData) => {
    return window.api.invoke('exemplaire:create', exemplaireData);
  },

  /**
   * Update an exemplaire
   * @param {number} id - Exemplaire ID
   * @param {Object} exemplaireData - Updated exemplaire data
   * @returns {Promise<Object>} Updated exemplaire
   */
  updateExemplaire: async (id, exemplaireData) => {
    return window.api.invoke('exemplaire:update', id, exemplaireData);
  },

  /**
   * Delete an exemplaire
   * @param {number} id - Exemplaire ID
   * @returns {Promise<boolean>} True if successful
   */
  deleteExemplaire: async (id) => {
    return window.api.invoke('exemplaire:delete', id);
  }
};

// Export all APIs
export default {
  FilmAPI,
  CategoryAPI,
  FormatAPI,
  ExemplaireAPI
};