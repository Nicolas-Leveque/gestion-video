const yup = require('yup');

/**
 * Validation schema for format data
 */
const formatSchema = yup.object().shape({
  // Required fields
  nom: yup.string()
    .required('Le nom du format est requis')
    .max(50, 'Le nom du format ne peut pas dépasser 50 caractères')
});

/**
 * Validate format data
 * @param {Object} data - Format data to validate
 * @returns {Promise<Object>} Validated data
 * @throws {Error} Validation error
 */
const validateFormat = async (data) => {
  try {
    return await formatSchema.validate(data, { abortEarly: false });
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
  formatSchema,
  validateFormat
};