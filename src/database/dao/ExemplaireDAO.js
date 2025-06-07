const { Exemplaire, Film, Format } = require('../models');
const { validateExemplaire } = require('../../validation');

class ExemplaireDAO {
  /**
   * Create a new exemplaire
   * @param {Object} exemplaireData - Exemplaire data
   * @param {number} exemplaireData.film_id - Film ID
   * @param {number} exemplaireData.format_id - Format ID
   * @param {string} [exemplaireData.emplacement] - Location
   * @param {string} [exemplaireData.notes] - Notes
   * @returns {Promise<Object>} Created exemplaire
   */
  async createExemplaire(exemplaireData) {
    try {
      // Validate exemplaire data
      const validatedData = await validateExemplaire(exemplaireData);

      const exemplaire = await Exemplaire.create({
        film_id: validatedData.film_id,
        format_id: validatedData.format_id,
        emplacement: validatedData.emplacement,
        notes: validatedData.notes
      });

      return this.getExemplaireById(exemplaire.id);
    } catch (error) {
      console.error('Error creating exemplaire:', error);
      throw error;
    }
  }

  /**
   * Get an exemplaire by ID
   * @param {number} id - Exemplaire ID
   * @returns {Promise<Object>} Exemplaire with film and format
   */
  async getExemplaireById(id) {
    try {
      const exemplaire = await Exemplaire.findByPk(id, {
        include: [
          { model: Film, as: 'film' },
          { model: Format, as: 'format' }
        ]
      });
      return exemplaire;
    } catch (error) {
      console.error(`Error getting exemplaire with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get all exemplaires
   * @param {Object} [options] - Query options
   * @param {number} [options.limit] - Maximum number of exemplaires to return
   * @param {number} [options.offset] - Number of exemplaires to skip
   * @returns {Promise<Object[]>} Array of exemplaires with film and format
   */
  async getAllExemplaires(options = {}) {
    try {
      const queryOptions = {
        include: [
          { model: Film, as: 'film' },
          { model: Format, as: 'format' }
        ],
        order: [['id', 'ASC']]
      };

      if (options.limit) {
        queryOptions.limit = options.limit;
      }

      if (options.offset) {
        queryOptions.offset = options.offset;
      }

      const exemplaires = await Exemplaire.findAll(queryOptions);
      return exemplaires;
    } catch (error) {
      console.error('Error getting all exemplaires:', error);
      throw error;
    }
  }

  /**
   * Get exemplaires by film ID
   * @param {number} filmId - Film ID
   * @returns {Promise<Object[]>} Array of exemplaires with format
   */
  async getExemplairesByFilmId(filmId) {
    try {
      const exemplaires = await Exemplaire.findAll({
        where: { film_id: filmId },
        include: [{ model: Format, as: 'format' }],
        order: [['id', 'ASC']]
      });
      return exemplaires;
    } catch (error) {
      console.error(`Error getting exemplaires for film with ID ${filmId}:`, error);
      throw error;
    }
  }

  /**
   * Get exemplaires by format ID
   * @param {number} formatId - Format ID
   * @returns {Promise<Object[]>} Array of exemplaires with film
   */
  async getExemplairesByFormatId(formatId) {
    try {
      const exemplaires = await Exemplaire.findAll({
        where: { format_id: formatId },
        include: [{ model: Film, as: 'film' }],
        order: [['id', 'ASC']]
      });
      return exemplaires;
    } catch (error) {
      console.error(`Error getting exemplaires for format with ID ${formatId}:`, error);
      throw error;
    }
  }

  /**
   * Update an exemplaire
   * @param {number} id - Exemplaire ID
   * @param {Object} exemplaireData - Updated exemplaire data
   * @param {number} [exemplaireData.film_id] - Film ID
   * @param {number} [exemplaireData.format_id] - Format ID
   * @param {string} [exemplaireData.emplacement] - Location
   * @param {string} [exemplaireData.notes] - Notes
   * @returns {Promise<Object>} Updated exemplaire
   */
  async updateExemplaire(id, exemplaireData) {
    try {
      // Validate exemplaire data
      const validatedData = await validateExemplaire(exemplaireData);

      const exemplaire = await Exemplaire.findByPk(id);
      if (!exemplaire) {
        throw new Error(`Exemplaire with ID ${id} not found`);
      }

      if (validatedData.film_id !== undefined) exemplaire.film_id = validatedData.film_id;
      if (validatedData.format_id !== undefined) exemplaire.format_id = validatedData.format_id;
      if (validatedData.emplacement !== undefined) exemplaire.emplacement = validatedData.emplacement;
      if (validatedData.notes !== undefined) exemplaire.notes = validatedData.notes;

      await exemplaire.save();

      return this.getExemplaireById(id);
    } catch (error) {
      console.error(`Error updating exemplaire with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete an exemplaire
   * @param {number} id - Exemplaire ID
   * @returns {Promise<boolean>} True if successful
   */
  async deleteExemplaire(id) {
    try {
      const exemplaire = await Exemplaire.findByPk(id);
      if (!exemplaire) {
        throw new Error(`Exemplaire with ID ${id} not found`);
      }

      await exemplaire.destroy();
      return true;
    } catch (error) {
      console.error(`Error deleting exemplaire with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete all exemplaires for a film
   * @param {number} filmId - Film ID
   * @returns {Promise<number>} Number of deleted exemplaires
   */
  async deleteExemplairesByFilmId(filmId) {
    try {
      const count = await Exemplaire.destroy({
        where: { film_id: filmId }
      });
      return count;
    } catch (error) {
      console.error(`Error deleting exemplaires for film with ID ${filmId}:`, error);
      throw error;
    }
  }
}

module.exports = new ExemplaireDAO();
