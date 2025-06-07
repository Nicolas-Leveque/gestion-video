const FilmDAO = require('../../database/dao/FilmDAO');
const { Film, Category, Format, Exemplaire } = require('../../database/models');
const { validateFilm } = require('../../validation');

// Mock the models and validation
jest.mock('../../database/models', () => {
  const mockFilm = {
    create: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
    destroy: jest.fn(),
    save: jest.fn(),
    addCategories: jest.fn(),
    setCategories: jest.fn(),
    sequelize: {
      transaction: jest.fn(callback => callback({ commit: jest.fn(), rollback: jest.fn() }))
    }
  };
  
  return {
    Film: mockFilm,
    Category: {},
    Format: {},
    Exemplaire: {
      create: jest.fn(),
      destroy: jest.fn(),
      findAll: jest.fn()
    }
  };
});

jest.mock('../../validation', () => ({
  validateFilm: jest.fn(data => Promise.resolve(data))
}));

describe('FilmDAO', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('createFilm', () => {
    it('should validate film data before creating', async () => {
      const filmData = {
        titre: 'Test Film',
        annee_sortie: 2023,
        realisateur: 'Test Director',
        duree: 120,
        synopsis: 'Test synopsis',
        categories: [1, 2],
        exemplaires: [
          { format_id: 1, emplacement: 'Test location', notes: 'Test notes' }
        ]
      };

      // Mock Film.create to return a film with an id
      Film.create.mockResolvedValue({ id: 1, ...filmData });
      
      // Mock Film.findByPk to return the created film
      Film.findByPk.mockResolvedValue({ id: 1, ...filmData });

      await FilmDAO.createFilm(filmData);

      // Check if validateFilm was called with the correct data
      expect(validateFilm).toHaveBeenCalledWith(filmData);
      
      // Check if Film.create was called with the correct data
      expect(Film.create).toHaveBeenCalledWith({
        titre: filmData.titre,
        annee_sortie: filmData.annee_sortie,
        realisateur: filmData.realisateur,
        duree: filmData.duree,
        synopsis: filmData.synopsis,
        chemin_affiche: undefined
      }, { transaction: expect.anything() });
      
      // Check if categories were added
      expect(Film.addCategories).toHaveBeenCalledWith(filmData.categories, { transaction: expect.anything() });
      
      // Check if exemplaires were created
      expect(Exemplaire.create).toHaveBeenCalledWith({
        film_id: 1,
        format_id: filmData.exemplaires[0].format_id,
        emplacement: filmData.exemplaires[0].emplacement,
        notes: filmData.exemplaires[0].notes
      }, { transaction: expect.anything() });
    });
  });

  describe('getFilmById', () => {
    it('should return a film by id', async () => {
      const film = {
        id: 1,
        titre: 'Test Film',
        annee_sortie: 2023
      };

      // Mock Film.findByPk to return a film
      Film.findByPk.mockResolvedValue(film);

      const result = await FilmDAO.getFilmById(1);

      // Check if Film.findByPk was called with the correct id
      expect(Film.findByPk).toHaveBeenCalledWith(1, expect.anything());
      
      // Check if the result is the expected film
      expect(result).toEqual(film);
    });
  });

  describe('updateFilm', () => {
    it('should validate film data before updating', async () => {
      const filmId = 1;
      const filmData = {
        titre: 'Updated Film',
        annee_sortie: 2024
      };

      // Mock Film.findByPk to return a film
      Film.findByPk.mockResolvedValue({
        id: filmId,
        titre: 'Test Film',
        annee_sortie: 2023,
        save: jest.fn()
      });

      await FilmDAO.updateFilm(filmId, filmData);

      // Check if validateFilm was called with the correct data
      expect(validateFilm).toHaveBeenCalledWith(filmData);
    });
  });

  describe('deleteFilm', () => {
    it('should delete a film by id', async () => {
      const filmId = 1;

      // Mock Film.findByPk to return a film
      Film.findByPk.mockResolvedValue({
        id: filmId,
        destroy: jest.fn().mockResolvedValue(true)
      });

      const result = await FilmDAO.deleteFilm(filmId);

      // Check if Film.findByPk was called with the correct id
      expect(Film.findByPk).toHaveBeenCalledWith(filmId);
      
      // Check if film.destroy was called
      expect(Film.findByPk().destroy).toHaveBeenCalled();
      
      // Check if the result is true
      expect(result).toBe(true);
    });

    it('should throw an error if film is not found', async () => {
      const filmId = 999;

      // Mock Film.findByPk to return null
      Film.findByPk.mockResolvedValue(null);

      await expect(FilmDAO.deleteFilm(filmId)).rejects.toThrow(`Film with ID ${filmId} not found`);
    });
  });
});