const { Category, Film } = require('../models');
const { validateCategory } = require('../../validation');

class CategoryDAO {
  /**
   * Create a new category
   * @param {Object} categoryData - Category data
   * @param {string} categoryData.nom - Category name
   * @returns {Promise<Object>} Created category
   */
  async createCategory(categoryData) {
    try {
      // Validate category data
      const validatedData = await validateCategory(categoryData);

      const category = await Category.create({
        nom: validatedData.nom
      });
      return category;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  /**
   * Get a category by ID
   * @param {number} id - Category ID
   * @param {boolean} [includeFilms=false] - Whether to include associated films
   * @returns {Promise<Object>} Category
   */
  async getCategoryById(id, includeFilms = false) {
    try {
      const options = {};

      if (includeFilms) {
        options.include = [{ model: Film, as: 'films' }];
      }

      const category = await Category.findByPk(id, options);
      return category;
    } catch (error) {
      console.error(`Error getting category with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get all categories
   * @param {boolean} [includeFilms=false] - Whether to include associated films
   * @returns {Promise<Object[]>} Array of categories
   */
  async getAllCategories(includeFilms = false) {
    try {
      const options = {
        order: [['nom', 'ASC']]
      };

      if (includeFilms) {
        options.include = [{ model: Film, as: 'films' }];
      }

      const categories = await Category.findAll(options);
      return categories;
    } catch (error) {
      console.error('Error getting all categories:', error);
      throw error;
    }
  }

  /**
   * Update a category
   * @param {number} id - Category ID
   * @param {Object} categoryData - Updated category data
   * @param {string} categoryData.nom - Category name
   * @returns {Promise<Object>} Updated category
   */
  async updateCategory(id, categoryData) {
    try {
      // Validate category data
      const validatedData = await validateCategory(categoryData);

      const category = await Category.findByPk(id);
      if (!category) {
        throw new Error(`Category with ID ${id} not found`);
      }

      category.nom = validatedData.nom;
      await category.save();

      return category;
    } catch (error) {
      console.error(`Error updating category with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a category
   * @param {number} id - Category ID
   * @returns {Promise<boolean>} True if successful
   */
  async deleteCategory(id) {
    try {
      const category = await Category.findByPk(id);
      if (!category) {
        throw new Error(`Category with ID ${id} not found`);
      }

      await category.destroy();
      return true;
    } catch (error) {
      console.error(`Error deleting category with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get categories with film count
   * @returns {Promise<Object[]>} Array of categories with film count
   */
  async getCategoriesWithFilmCount() {
    try {
      const categories = await Category.findAll({
        include: [{ 
          model: Film, 
          as: 'films',
          attributes: [] // Don't include film data, just count
        }],
        attributes: {
          include: [
            [
              Category.sequelize.literal('(SELECT COUNT(*) FROM film_categories WHERE film_categories.categorie_id = Category.id)'),
              'filmCount'
            ]
          ]
        },
        order: [['nom', 'ASC']]
      });

      return categories;
    } catch (error) {
      console.error('Error getting categories with film count:', error);
      throw error;
    }
  }
}

module.exports = new CategoryDAO();
