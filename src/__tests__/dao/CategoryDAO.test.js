const CategoryDAO = require('../../database/dao/CategoryDAO');
const { Category, Film } = require('../../database/models');
const { validateCategory } = require('../../validation');

// Mock the models and validation
jest.mock('../../database/models', () => {
  const mockCategory = {
    create: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
    destroy: jest.fn(),
    save: jest.fn(),
    sequelize: {
      literal: jest.fn().mockReturnValue('LITERAL')
    }
  };
  
  return {
    Category: mockCategory,
    Film: {}
  };
});

jest.mock('../../validation', () => ({
  validateCategory: jest.fn(data => Promise.resolve(data))
}));

describe('CategoryDAO', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('createCategory', () => {
    it('should validate category data before creating', async () => {
      const categoryData = {
        nom: 'Test Category'
      };

      // Mock Category.create to return a category with an id
      Category.create.mockResolvedValue({ id: 1, ...categoryData });

      await CategoryDAO.createCategory(categoryData);

      // Check if validateCategory was called with the correct data
      expect(validateCategory).toHaveBeenCalledWith(categoryData);
      
      // Check if Category.create was called with the correct data
      expect(Category.create).toHaveBeenCalledWith({
        nom: categoryData.nom
      });
    });
  });

  describe('getCategoryById', () => {
    it('should return a category by id', async () => {
      const category = {
        id: 1,
        nom: 'Test Category'
      };

      // Mock Category.findByPk to return a category
      Category.findByPk.mockResolvedValue(category);

      const result = await CategoryDAO.getCategoryById(1);

      // Check if Category.findByPk was called with the correct id
      expect(Category.findByPk).toHaveBeenCalledWith(1, expect.anything());
      
      // Check if the result is the expected category
      expect(result).toEqual(category);
    });

    it('should include films if includeFilms is true', async () => {
      const category = {
        id: 1,
        nom: 'Test Category',
        films: []
      };

      // Mock Category.findByPk to return a category with films
      Category.findByPk.mockResolvedValue(category);

      const result = await CategoryDAO.getCategoryById(1, true);

      // Check if Category.findByPk was called with the correct options
      expect(Category.findByPk).toHaveBeenCalledWith(1, {
        include: [{ model: Film, as: 'films' }]
      });
      
      // Check if the result is the expected category
      expect(result).toEqual(category);
    });
  });

  describe('getAllCategories', () => {
    it('should return all categories', async () => {
      const categories = [
        { id: 1, nom: 'Category 1' },
        { id: 2, nom: 'Category 2' }
      ];

      // Mock Category.findAll to return categories
      Category.findAll.mockResolvedValue(categories);

      const result = await CategoryDAO.getAllCategories();

      // Check if Category.findAll was called with the correct options
      expect(Category.findAll).toHaveBeenCalledWith({
        order: [['nom', 'ASC']]
      });
      
      // Check if the result is the expected categories
      expect(result).toEqual(categories);
    });
  });

  describe('updateCategory', () => {
    it('should validate category data before updating', async () => {
      const categoryId = 1;
      const categoryData = {
        nom: 'Updated Category'
      };

      // Mock Category.findByPk to return a category
      Category.findByPk.mockResolvedValue({
        id: categoryId,
        nom: 'Test Category',
        save: jest.fn()
      });

      await CategoryDAO.updateCategory(categoryId, categoryData);

      // Check if validateCategory was called with the correct data
      expect(validateCategory).toHaveBeenCalledWith(categoryData);
      
      // Check if the category was updated with the correct data
      expect(Category.findByPk().nom).toBe(categoryData.nom);
      
      // Check if category.save was called
      expect(Category.findByPk().save).toHaveBeenCalled();
    });

    it('should throw an error if category is not found', async () => {
      const categoryId = 999;
      const categoryData = {
        nom: 'Updated Category'
      };

      // Mock Category.findByPk to return null
      Category.findByPk.mockResolvedValue(null);

      await expect(CategoryDAO.updateCategory(categoryId, categoryData)).rejects.toThrow(`Category with ID ${categoryId} not found`);
    });
  });

  describe('deleteCategory', () => {
    it('should delete a category by id', async () => {
      const categoryId = 1;

      // Mock Category.findByPk to return a category
      Category.findByPk.mockResolvedValue({
        id: categoryId,
        destroy: jest.fn().mockResolvedValue(true)
      });

      const result = await CategoryDAO.deleteCategory(categoryId);

      // Check if Category.findByPk was called with the correct id
      expect(Category.findByPk).toHaveBeenCalledWith(categoryId);
      
      // Check if category.destroy was called
      expect(Category.findByPk().destroy).toHaveBeenCalled();
      
      // Check if the result is true
      expect(result).toBe(true);
    });

    it('should throw an error if category is not found', async () => {
      const categoryId = 999;

      // Mock Category.findByPk to return null
      Category.findByPk.mockResolvedValue(null);

      await expect(CategoryDAO.deleteCategory(categoryId)).rejects.toThrow(`Category with ID ${categoryId} not found`);
    });
  });

  describe('getCategoriesWithFilmCount', () => {
    it('should return categories with film count', async () => {
      const categories = [
        { id: 1, nom: 'Category 1', get: () => 5 }, // 5 films
        { id: 2, nom: 'Category 2', get: () => 3 }  // 3 films
      ];

      // Mock Category.findAll to return categories with film count
      Category.findAll.mockResolvedValue(categories);

      const result = await CategoryDAO.getCategoriesWithFilmCount();

      // Check if Category.findAll was called with the correct options
      expect(Category.findAll).toHaveBeenCalledWith({
        include: [{ 
          model: Film, 
          as: 'films',
          attributes: []
        }],
        attributes: {
          include: [
            [
              'LITERAL',
              'filmCount'
            ]
          ]
        },
        order: [['nom', 'ASC']]
      });
      
      // Check if the result is the expected categories
      expect(result).toEqual(categories);
    });
  });
});