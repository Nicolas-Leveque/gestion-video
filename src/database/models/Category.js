const { DataTypes } = require('sequelize');
const { sequelize } = require('../init-db');

const Category = sequelize.define('Category', {
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
  tableName: 'categories',
  timestamps: false
});

module.exports = Category;