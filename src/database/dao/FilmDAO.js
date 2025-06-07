const { Film, Category, Format, Exemplaire } = require('../models');
const { Op } = require('sequelize');
const { validateFilm } = require('../../validation');

class FilmDAO {
  /**
   * Create a new film
   * @param {Object} filmData - Film data
   * @param {string} filmData.titre - Film title
   * @param {number} filmData.annee_sortie - Release year
   * @param {string} [filmData.realisateur] - Director
   * @param {number} [filmData.duree] - Duration in minutes
   * @param {string} [filmData.synopsis] - Synopsis
   * @param {string} [filmData.chemin_affiche] - Path to poster image
   * @param {number[]} [filmData.categories] - Array of category IDs
   * @param {Object[]} [filmData.exemplaires] - Array of exemplaire objects
   * @returns {Promise<Object>} Created film
   */
  async createFilm(filmData) {
    try {
      // Validate film data
      const validatedData = await validateFilm(filmData);

      // Start a transaction
      const result = await Film.sequelize.transaction(async (t) => {
        // Create the film
        const film = await Film.create({
          titre: validatedData.titre,
          annee_sortie: validatedData.annee_sortie,
          realisateur: validatedData.realisateur,
          duree: validatedData.duree,
          synopsis: validatedData.synopsis,
          chemin_affiche: validatedData.chemin_affiche
        }, { transaction: t });

        // Add categories if provided
        if (validatedData.categories && validatedData.categories.length > 0) {
          await film.addCategories(validatedData.categories, { transaction: t });
        }

        // Add exemplaires if provided
        if (validatedData.exemplaires && validatedData.exemplaires.length > 0) {
          for (const exemplaire of validatedData.exemplaires) {
            await Exemplaire.create({
              film_id: film.id,
              format_id: exemplaire.format_id,
              emplacement: exemplaire.emplacement,
              notes: exemplaire.notes
            }, { transaction: t });
          }
        }

        // Return the created film with its associations
        return this.getFilmById(film.id, t);
      });

      return result;
    } catch (error) {
      console.error('Error creating film:', error);
      throw error;
    }
  }

  /**
   * Get a film by ID
   * @param {number} id - Film ID
   * @param {Transaction} [transaction] - Sequelize transaction
   * @returns {Promise<Object>} Film with its categories and exemplaires
   */
  async getFilmById(id, transaction = null) {
    try {
      const options = {
        include: [
          { model: Category, as: 'categories' },
          { 
            model: Exemplaire, 
            as: 'exemplaires',
            include: [{ model: Format, as: 'format' }]
          }
        ]
      };

      if (transaction) {
        options.transaction = transaction;
      }

      const film = await Film.findByPk(id, options);
      return film;
    } catch (error) {
      console.error(`Error getting film with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get all films
   * @param {Object} [options] - Query options
   * @param {number} [options.limit] - Maximum number of films to return
   * @param {number} [options.offset] - Number of films to skip
   * @param {string} [options.orderBy] - Field to order by
   * @param {string} [options.order] - Order direction ('ASC' or 'DESC')
   * @returns {Promise<Object[]>} Array of films
   */
  async getAllFilms(options = {}) {
    try {
      const queryOptions = {
        include: [
          { model: Category, as: 'categories' },
          { 
            model: Exemplaire, 
            as: 'exemplaires',
            include: [{ model: Format, as: 'format' }]
          }
        ],
        order: [[options.orderBy || 'titre', options.order || 'ASC']]
      };

      if (options.limit) {
        queryOptions.limit = options.limit;
      }

      if (options.offset) {
        queryOptions.offset = options.offset;
      }

      const films = await Film.findAll(queryOptions);
      return films;
    } catch (error) {
      console.error('Error getting all films:', error);
      throw error;
    }
  }

  /**
   * Search for films
   * @param {Object} criteria - Search criteria
   * @param {string} [criteria.titre] - Film title
   * @param {number} [criteria.annee_min] - Minimum release year
   * @param {number} [criteria.annee_max] - Maximum release year
   * @param {number[]} [criteria.categories] - Array of category IDs
   * @param {number[]} [criteria.formats] - Array of format IDs
   * @returns {Promise<Object[]>} Array of matching films
   */
  async searchFilms(criteria = {}) {
    try {
      const where = {};
      const include = [];

      // Title search (case insensitive)
      if (criteria.titre) {
        where.titre = {
          [Op.like]: `%${criteria.titre}%`
        };
      }

      // Year range
      if (criteria.annee_min || criteria.annee_max) {
        where.annee_sortie = {};
        if (criteria.annee_min) {
          where.annee_sortie[Op.gte] = criteria.annee_min;
        }
        if (criteria.annee_max) {
          where.annee_sortie[Op.lte] = criteria.annee_max;
        }
      }

      // Categories
      include.push({ 
        model: Category, 
        as: 'categories',
        ...(criteria.categories && criteria.categories.length > 0 ? {
          where: {
            id: {
              [Op.in]: criteria.categories
            }
          }
        } : {})
      });

      // Formats (via exemplaires)
      include.push({ 
        model: Exemplaire, 
        as: 'exemplaires',
        include: [{ 
          model: Format, 
          as: 'format',
          ...(criteria.formats && criteria.formats.length > 0 ? {
            where: {
              id: {
                [Op.in]: criteria.formats
              }
            }
          } : {})
        }]
      });

      const films = await Film.findAll({
        where,
        include,
        order: [['titre', 'ASC']]
      });

      return films;
    } catch (error) {
      console.error('Error searching films:', error);
      throw error;
    }
  }

  /**
   * Update a film
   * @param {number} id - Film ID
   * @param {Object} filmData - Updated film data
   * @returns {Promise<Object>} Updated film
   */
  async updateFilm(id, filmData) {
    try {
      // Validate film data
      const validatedData = await validateFilm(filmData);

      // Start a transaction
      const result = await Film.sequelize.transaction(async (t) => {
        // Get the film
        const film = await Film.findByPk(id, { transaction: t });
        if (!film) {
          throw new Error(`Film with ID ${id} not found`);
        }

        // Update film properties
        if (validatedData.titre !== undefined) film.titre = validatedData.titre;
        if (validatedData.annee_sortie !== undefined) film.annee_sortie = validatedData.annee_sortie;
        if (validatedData.realisateur !== undefined) film.realisateur = validatedData.realisateur;
        if (validatedData.duree !== undefined) film.duree = validatedData.duree;
        if (validatedData.synopsis !== undefined) film.synopsis = validatedData.synopsis;
        if (validatedData.chemin_affiche !== undefined) film.chemin_affiche = validatedData.chemin_affiche;

        await film.save({ transaction: t });

        // Update categories if provided
        if (validatedData.categories) {
          await film.setCategories(validatedData.categories, { transaction: t });
        }

        // Update exemplaires if provided
        if (validatedData.exemplaires) {
          // Delete existing exemplaires
          await Exemplaire.destroy({
            where: { film_id: film.id },
            transaction: t
          });

          // Create new exemplaires
          for (const exemplaire of validatedData.exemplaires) {
            await Exemplaire.create({
              film_id: film.id,
              format_id: exemplaire.format_id,
              emplacement: exemplaire.emplacement,
              notes: exemplaire.notes
            }, { transaction: t });
          }
        }

        // Return the updated film with its associations
        return this.getFilmById(film.id, t);
      });

      return result;
    } catch (error) {
      console.error(`Error updating film with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a film
   * @param {number} id - Film ID
   * @returns {Promise<boolean>} True if successful
   */
  async deleteFilm(id) {
    try {
      const film = await Film.findByPk(id);
      if (!film) {
        throw new Error(`Film with ID ${id} not found`);
      }

      await film.destroy();
      return true;
    } catch (error) {
      console.error(`Error deleting film with ID ${id}:`, error);
      throw error;
    }
  }
}

module.exports = new FilmDAO();
