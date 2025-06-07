const { DataTypes } = require('sequelize');
const { sequelize } = require('../init-db');

const Format = sequelize.define('Format', {
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
}, {
  tableName: 'formats',
  timestamps: false
});

module.exports = Format;