const Film = require('./Film');
const Category = require('./Category');
const Format = require('./Format');
const Exemplaire = require('./Exemplaire');
const { sequelize } = require('../init-db');

// Define associations
Film.belongsToMany(Category, { 
  through: 'film_categories',
  foreignKey: 'film_id',
  otherKey: 'categorie_id',
  as: 'categories'
});

Category.belongsToMany(Film, { 
  through: 'film_categories',
  foreignKey: 'categorie_id',
  otherKey: 'film_id',
  as: 'films'
});

Film.hasMany(Exemplaire, {
  foreignKey: 'film_id',
  as: 'exemplaires'
});

Exemplaire.belongsTo(Film, {
  foreignKey: 'film_id',
  as: 'film'
});

Format.hasMany(Exemplaire, {
  foreignKey: 'format_id',
  as: 'exemplaires'
});

Exemplaire.belongsTo(Format, {
  foreignKey: 'format_id',
  as: 'format'
});

// Export models and sequelize instance
module.exports = {
  sequelize,
  Film,
  Category,
  Format,
  Exemplaire
};