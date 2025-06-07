const { DataTypes } = require('sequelize');
const { sequelize } = require('../../database/init-db');
const Category = require('../../database/models/Category');

// Mock the sequelize instance
jest.mock('../../database/init-db', () => ({
  sequelize: {
    define: jest.fn().mockReturnValue({
      findAll: jest.fn(),
      findByPk: jest.fn(),
      create: jest.fn(),
      destroy: jest.fn(),
      belongsToMany: jest.fn(),
    }),
  },
}));

describe('Category Model', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should define the Category model with correct attributes', () => {
    // Import the model to trigger the define call
    require('../../database/models/Category');

    // Check if sequelize.define was called with the correct parameters
    expect(sequelize.define).toHaveBeenCalledWith(
      'Category',
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        nom: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
        }
      },
      {
        tableName: 'categories',
        timestamps: false
      }
    );
  });

  it('should export the Category model', () => {
    expect(Category).toBeDefined();
  });
});