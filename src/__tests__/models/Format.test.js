const { DataTypes } = require('sequelize');
const { sequelize } = require('../../database/init-db');
const Format = require('../../database/models/Format');

// Mock the sequelize instance
jest.mock('../../database/init-db', () => ({
  sequelize: {
    define: jest.fn().mockReturnValue({
      findAll: jest.fn(),
      findByPk: jest.fn(),
      create: jest.fn(),
      destroy: jest.fn(),
      hasMany: jest.fn(),
    }),
  },
}));

describe('Format Model', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should define the Format model with correct attributes', () => {
    // Import the model to trigger the define call
    require('../../database/models/Format');

    // Check if sequelize.define was called with the correct parameters
    expect(sequelize.define).toHaveBeenCalledWith(
      'Format',
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
        tableName: 'formats',
        timestamps: false
      }
    );
  });

  it('should export the Format model', () => {
    expect(Format).toBeDefined();
  });
});