const { ipcMain } = require('electron');
const { FilmDAO, CategoryDAO, FormatDAO, ExemplaireDAO } = require('../database/dao');

/**
 * Register IPC handlers for database operations
 */
function registerDatabaseHandlers() {
  // Film handlers
  ipcMain.handle('film:get', async (event, id) => {
    try {
      return await FilmDAO.getFilmById(id);
    } catch (error) {
      console.error('IPC film:get error:', error);
      throw error;
    }
  });

  ipcMain.handle('film:getAll', async (event, options) => {
    try {
      return await FilmDAO.getAllFilms(options);
    } catch (error) {
      console.error('IPC film:getAll error:', error);
      throw error;
    }
  });

  ipcMain.handle('film:search', async (event, criteria) => {
    try {
      return await FilmDAO.searchFilms(criteria);
    } catch (error) {
      console.error('IPC film:search error:', error);
      throw error;
    }
  });

  ipcMain.handle('film:create', async (event, filmData) => {
    try {
      return await FilmDAO.createFilm(filmData);
    } catch (error) {
      console.error('IPC film:create error:', error);
      throw error;
    }
  });

  ipcMain.handle('film:update', async (event, id, filmData) => {
    try {
      return await FilmDAO.updateFilm(id, filmData);
    } catch (error) {
      console.error('IPC film:update error:', error);
      throw error;
    }
  });

  ipcMain.handle('film:delete', async (event, id) => {
    try {
      return await FilmDAO.deleteFilm(id);
    } catch (error) {
      console.error('IPC film:delete error:', error);
      throw error;
    }
  });

  // Category handlers
  ipcMain.handle('category:get', async (event, id) => {
    try {
      return await CategoryDAO.getCategoryById(id);
    } catch (error) {
      console.error('IPC category:get error:', error);
      throw error;
    }
  });

  ipcMain.handle('category:getAll', async (event, includeFilms) => {
    try {
      return await CategoryDAO.getAllCategories(includeFilms);
    } catch (error) {
      console.error('IPC category:getAll error:', error);
      throw error;
    }
  });

  ipcMain.handle('category:getWithFilmCount', async () => {
    try {
      return await CategoryDAO.getCategoriesWithFilmCount();
    } catch (error) {
      console.error('IPC category:getWithFilmCount error:', error);
      throw error;
    }
  });

  ipcMain.handle('category:create', async (event, categoryData) => {
    try {
      return await CategoryDAO.createCategory(categoryData);
    } catch (error) {
      console.error('IPC category:create error:', error);
      throw error;
    }
  });

  ipcMain.handle('category:update', async (event, id, categoryData) => {
    try {
      return await CategoryDAO.updateCategory(id, categoryData);
    } catch (error) {
      console.error('IPC category:update error:', error);
      throw error;
    }
  });

  ipcMain.handle('category:delete', async (event, id) => {
    try {
      return await CategoryDAO.deleteCategory(id);
    } catch (error) {
      console.error('IPC category:delete error:', error);
      throw error;
    }
  });

  // Format handlers
  ipcMain.handle('format:get', async (event, id) => {
    try {
      return await FormatDAO.getFormatById(id);
    } catch (error) {
      console.error('IPC format:get error:', error);
      throw error;
    }
  });

  ipcMain.handle('format:getAll', async (event, includeExemplaires) => {
    try {
      return await FormatDAO.getAllFormats(includeExemplaires);
    } catch (error) {
      console.error('IPC format:getAll error:', error);
      throw error;
    }
  });

  ipcMain.handle('format:getWithExemplaireCount', async () => {
    try {
      return await FormatDAO.getFormatsWithExemplaireCount();
    } catch (error) {
      console.error('IPC format:getWithExemplaireCount error:', error);
      throw error;
    }
  });

  ipcMain.handle('format:create', async (event, formatData) => {
    try {
      return await FormatDAO.createFormat(formatData);
    } catch (error) {
      console.error('IPC format:create error:', error);
      throw error;
    }
  });

  ipcMain.handle('format:update', async (event, id, formatData) => {
    try {
      return await FormatDAO.updateFormat(id, formatData);
    } catch (error) {
      console.error('IPC format:update error:', error);
      throw error;
    }
  });

  ipcMain.handle('format:delete', async (event, id) => {
    try {
      return await FormatDAO.deleteFormat(id);
    } catch (error) {
      console.error('IPC format:delete error:', error);
      throw error;
    }
  });

  // Exemplaire handlers
  ipcMain.handle('exemplaire:get', async (event, id) => {
    try {
      return await ExemplaireDAO.getExemplaireById(id);
    } catch (error) {
      console.error('IPC exemplaire:get error:', error);
      throw error;
    }
  });

  ipcMain.handle('exemplaire:getAll', async (event, options) => {
    try {
      return await ExemplaireDAO.getAllExemplaires(options);
    } catch (error) {
      console.error('IPC exemplaire:getAll error:', error);
      throw error;
    }
  });

  ipcMain.handle('exemplaire:getByFilm', async (event, filmId) => {
    try {
      return await ExemplaireDAO.getExemplairesByFilmId(filmId);
    } catch (error) {
      console.error('IPC exemplaire:getByFilm error:', error);
      throw error;
    }
  });

  ipcMain.handle('exemplaire:getByFormat', async (event, formatId) => {
    try {
      return await ExemplaireDAO.getExemplairesByFormatId(formatId);
    } catch (error) {
      console.error('IPC exemplaire:getByFormat error:', error);
      throw error;
    }
  });

  ipcMain.handle('exemplaire:create', async (event, exemplaireData) => {
    try {
      return await ExemplaireDAO.createExemplaire(exemplaireData);
    } catch (error) {
      console.error('IPC exemplaire:create error:', error);
      throw error;
    }
  });

  ipcMain.handle('exemplaire:update', async (event, id, exemplaireData) => {
    try {
      return await ExemplaireDAO.updateExemplaire(id, exemplaireData);
    } catch (error) {
      console.error('IPC exemplaire:update error:', error);
      throw error;
    }
  });

  ipcMain.handle('exemplaire:delete', async (event, id) => {
    try {
      return await ExemplaireDAO.deleteExemplaire(id);
    } catch (error) {
      console.error('IPC exemplaire:delete error:', error);
      throw error;
    }
  });

  console.log('Database IPC handlers registered');
}

module.exports = { registerDatabaseHandlers };