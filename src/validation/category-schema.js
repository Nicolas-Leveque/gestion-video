const yup = require('yup');

/**
 * Validation schema for category data
 */
const categorySchema = yup.object().shape({
  // Required fields
  nom: yup.string()
    .required('Le nom de la catégorie est requis')
    .max(100, 'Le nom de la catégorie ne peut pas dépasser 100 caractères')
});

/**
 * Validate category data
 * @param {Object} data - Category data to validate
 * @returns {Promise<Object>} Validated data
 * @throws {Error} Validation error
 */
const validateCategory = async (data) => {
  try {
    return await categorySchema.validate(data, { abortEarly: false });
  } catch (error) {
    // Format validation errors
    if (error.name === 'ValidationError') {
      const errors = {};
      error.inner.forEach(err => {
        errors[err.path] = err.message;
      });
      throw { name: 'ValidationError', errors };
    }
    throw error;
  }
};

module.exports = {
  categorySchema,
  validateCategory
};