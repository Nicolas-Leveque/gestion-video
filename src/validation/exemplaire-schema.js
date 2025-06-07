const yup = require('yup');

/**
 * Validation schema for exemplaire data
 */
const exemplaireSchema = yup.object().shape({
  // Required fields
  film_id: yup.number()
    .required('L\'identifiant du film est requis')
    .integer('L\'identifiant du film doit être un nombre entier')
    .positive('L\'identifiant du film doit être positif'),
  
  format_id: yup.number()
    .required('L\'identifiant du format est requis')
    .integer('L\'identifiant du format doit être un nombre entier')
    .positive('L\'identifiant du format doit être positif'),
  
  // Optional fields
  emplacement: yup.string()
    .nullable()
    .max(255, 'L\'emplacement ne peut pas dépasser 255 caractères'),
  
  notes: yup.string()
    .nullable()
});

/**
 * Validate exemplaire data
 * @param {Object} data - Exemplaire data to validate
 * @returns {Promise<Object>} Validated data
 * @throws {Error} Validation error
 */
const validateExemplaire = async (data) => {
  try {
    return await exemplaireSchema.validate(data, { abortEarly: false });
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
  exemplaireSchema,
  validateExemplaire
};