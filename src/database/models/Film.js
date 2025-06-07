const { DataTypes } = require('sequelize');
const { sequelize } = require('../init-db');

const Film = sequelize.define('Film', {
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
}, {
  tableName: 'films',
  timestamps: false
});

module.exports = Film;