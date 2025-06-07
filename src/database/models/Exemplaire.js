const { DataTypes } = require('sequelize');
const { sequelize } = require('../init-db');

const Exemplaire = sequelize.define('Exemplaire', {
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
}, {
  tableName: 'exemplaires',
  timestamps: false
});

module.exports = Exemplaire;