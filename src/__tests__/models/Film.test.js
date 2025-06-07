const { DataTypes } = require('sequelize');
const { sequelize } = require('../../database/init-db');
const Film = require('../../database/models/Film');

// Mock the sequelize instance
jest.mock('../../database/init-db', () => ({
  sequelize: {
    define: jest.fn().mockReturnValue({
      findAll: jest.fn(),
      findByPk: jest.fn(),
      create: jest.fn(),
      destroy: jest.fn(),
      belongsToMany: jest.fn(),
      hasMany: jest.fn(),
    }),
  },
}));

describe('Film Model', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should define the Film model with correct attributes', () => {
    // Import the model to trigger the define call
    require('../../database/models/Film');

    // Check if sequelize.define was called with the correct parameters
    expect(sequelize.define).toHaveBeenCalledWith(
      'Film',
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        titre: {
          type: DataTypes.STRING,
          allowNull: false
        },
        annee_sortie: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        realisateur: {
          type: DataTypes.STRING,
          allowNull: true
        },
        duree: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        synopsis: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        chemin_affiche: {
          type: DataTypes.STRING,
          allowNull: true
        },
        date_ajout: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW
        }
      },
      {
        tableName: 'films',
        timestamps: false
      }
    );
  });

  it('should export the Film model', () => {
    expect(Film).toBeDefined();
  });
});