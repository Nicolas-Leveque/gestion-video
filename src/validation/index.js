/**
 * Export all validation schemas and functions
 */

const { filmSchema, validateFilm } = require('./film-schema');
const { categorySchema, validateCategory } = require('./category-schema');
const { formatSchema, validateFormat } = require('./format-schema');
const { exemplaireSchema, validateExemplaire } = require('./exemplaire-schema');

module.exports = {
  // Film validation
  filmSchema,
  validateFilm,
  
  // Category validation
  categorySchema,
  validateCategory,
  
  // Format validation
  formatSchema,
  validateFormat,
  
  // Exemplaire validation
  exemplaireSchema,
  validateExemplaire
};