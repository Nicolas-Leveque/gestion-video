const { Format, Exemplaire, Film } = require('../models');
const { validateFormat } = require('../../validation');

class FormatDAO {
  /**
   * Create a new format
   * @param {Object} formatData - Format data
   * @param {string} formatData.nom - Format name
   * @returns {Promise<Object>} Created format
   */
  async createFormat(formatData) {
    try {
      // Validate format data
      const validatedData = await validateFormat(formatData);

      const format = await Format.create({
        nom: validatedData.nom
      });
      return format;
    } catch (error) {
      console.error('Error creating format:', error);
      throw error;
    }
  }

  /**
   * Get a format by ID
   * @param {number} id - Format ID
   * @param {boolean} [includeExemplaires=false] - Whether to include associated exemplaires
   * @returns {Promise<Object>} Format
   */
  async getFormatById(id, includeExemplaires = false) {
    try {
      const options = {};

      if (includeExemplaires) {
        options.include = [{ 
          model: Exemplaire, 
          as: 'exemplaires',
          include: [{ model: Film, as: 'film' }]
        }];
      }

      const format = await Format.findByPk(id, options);
      return format;
    } catch (error) {
      console.error(`Error getting format with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get all formats
   * @param {boolean} [includeExemplaires=false] - Whether to include associated exemplaires
   * @returns {Promise<Object[]>} Array of formats
   */
  async getAllFormats(includeExemplaires = false) {
    try {
      const options = {
        order: [['nom', 'ASC']]
      };

      if (includeExemplaires) {
        options.include = [{ 
          model: Exemplaire, 
          as: 'exemplaires',
          include: [{ model: Film, as: 'film' }]
        }];
      }

      const formats = await Format.findAll(options);
      return formats;
    } catch (error) {
      console.error('Error getting all formats:', error);
      throw error;
    }
  }

  /**
   * Update a format
   * @param {number} id - Format ID
   * @param {Object} formatData - Updated format data
   * @param {string} formatData.nom - Format name
   * @returns {Promise<Object>} Updated format
   */
  async updateFormat(id, formatData) {
    try {
      // Validate format data
      const validatedData = await validateFormat(formatData);

      const format = await Format.findByPk(id);
      if (!format) {
        throw new Error(`Format with ID ${id} not found`);
      }

      format.nom = validatedData.nom;
      await format.save();

      return format;
    } catch (error) {
      console.error(`Error updating format with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a format
   * @param {number} id - Format ID
   * @returns {Promise<boolean>} True if successful
   */
  async deleteFormat(id) {
    try {
      const format = await Format.findByPk(id);
      if (!format) {
        throw new Error(`Format with ID ${id} not found`);
      }

      await format.destroy();
      return true;
    } catch (error) {
      console.error(`Error deleting format with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get formats with exemplaire count
   * @returns {Promise<Object[]>} Array of formats with exemplaire count
   */
  async getFormatsWithExemplaireCount() {
    try {
      const formats = await Format.findAll({
        include: [{ 
          model: Exemplaire, 
          as: 'exemplaires',
          attributes: [] // Don't include exemplaire data, just count
        }],
        attributes: {
          include: [
            [
              Format.sequelize.literal('(SELECT COUNT(*) FROM exemplaires WHERE exemplaires.format_id = Format.id)'),
              'exemplaireCount'
            ]
          ]
        },
        order: [['nom', 'ASC']]
      });

      return formats;
    } catch (error) {
      console.error('Error getting formats with exemplaire count:', error);
      throw error;
    }
  }
}

module.exports = new FormatDAO();
