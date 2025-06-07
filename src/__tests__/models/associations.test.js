const Film = require('../../database/models/Film');
const Category = require('../../database/models/Category');
const Format = require('../../database/models/Format');
const Exemplaire = require('../../database/models/Exemplaire');

// Mock the models
jest.mock('../../database/models/Film', () => ({
  belongsToMany: jest.fn(),
  hasMany: jest.fn(),
}));

jest.mock('../../database/models/Category', () => ({
  belongsToMany: jest.fn(),
}));

jest.mock('../../database/models/Format', () => ({
  hasMany: jest.fn(),
}));

jest.mock('../../database/models/Exemplaire', () => ({
  belongsTo: jest.fn(),
}));

describe('Model Associations', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should set up associations between models', () => {
    // Import the index file to trigger the association setup
    require('../../database/models/index');

    // Check Film associations
    expect(Film.belongsToMany).toHaveBeenCalledWith(Category, {
      through: 'film_categories',
      foreignKey: 'film_id',
      otherKey: 'categorie_id',
      as: 'categories'
    });

    expect(Film.hasMany).toHaveBeenCalledWith(Exemplaire, {
      foreignKey: 'film_id',
      as: 'exemplaires'
    });

    // Check Category associations
    expect(Category.belongsToMany).toHaveBeenCalledWith(Film, {
      through: 'film_categories',
      foreignKey: 'categorie_id',
      otherKey: 'film_id',
      as: 'films'
    });

    // Check Format associations
    expect(Format.hasMany).toHaveBeenCalledWith(Exemplaire, {
      foreignKey: 'format_id',
      as: 'exemplaires'
    });

    // Check Exemplaire associations
    expect(Exemplaire.belongsTo).toHaveBeenCalledWith(Film, {
      foreignKey: 'film_id',
      as: 'film'
    });

    expect(Exemplaire.belongsTo).toHaveBeenCalledWith(Format, {
      foreignKey: 'format_id',
      as: 'format'
    });
  });
});