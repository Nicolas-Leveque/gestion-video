const { DataTypes } = require('sequelize');
const { sequelize } = require('../../database/init-db');
const Exemplaire = require('../../database/models/Exemplaire');

// Mock the sequelize instance
jest.mock('../../database/init-db', () => ({
  sequelize: {
    define: jest.fn().mockReturnValue({
      findAll: jest.fn(),
      findByPk: jest.fn(),
      create: jest.fn(),
      destroy: jest.fn(),
      belongsTo: jest.fn(),
    }),
  },
}));

describe('Exemplaire Model', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should define the Exemplaire model with correct attributes', () => {
    // Import the model to trigger the define call
    require('../../database/models/Exemplaire');

    // Check if sequelize.define was called with the correct parameters
    expect(sequelize.define).toHaveBeenCalledWith(
      'Exemplaire',
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        film_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'films',
            key: 'id'
          }
        },
        format_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'formats',
            key: 'id'
          }
        },
        emplacement: {
          type: DataTypes.STRING,
          allowNull: true
        },
        notes: {
          type: DataTypes.TEXT,
          allowNull: true
        }
      },
      {
        tableName: 'exemplaires',
        timestamps: false
      }
    );
  });

  it('should export the Exemplaire model', () => {
    expect(Exemplaire).toBeDefined();
  });
});