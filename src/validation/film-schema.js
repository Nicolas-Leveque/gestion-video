const yup = require('yup');

/**
 * Validation schema for film data
 */
const filmSchema = yup.object().shape({
  // Required fields
  titre: yup.string()
    .required('Le titre est requis')
    .max(255, 'Le titre ne peut pas dépasser 255 caractères'),
  
  annee_sortie: yup.number()
    .required('L\'année de sortie est requise')
    .integer('L\'année de sortie doit être un nombre entier')
    .min(1800, 'L\'année de sortie doit être supérieure à 1800')
    .max(new Date().getFullYear() + 5, `L'année de sortie ne peut pas dépasser ${new Date().getFullYear() + 5}`),
  
  // Optional fields
  realisateur: yup.string()
    .nullable()
    .max(255, 'Le nom du réalisateur ne peut pas dépasser 255 caractères'),
  
  duree: yup.number()
    .nullable()
    .integer('La durée doit être un nombre entier')
    .min(1, 'La durée doit être positive')
    .max(1000, 'La durée ne peut pas dépasser 1000 minutes'),
  
  synopsis: yup.string()
    .nullable(),
  
  chemin_affiche: yup.string()
    .nullable()
    .max(255, 'Le chemin de l\'affiche ne peut pas dépasser 255 caractères'),
  
  // Related entities
  categories: yup.array()
    .of(yup.number().integer().positive())
    .min(0, 'Les catégories doivent être un tableau d\'identifiants'),
  
  exemplaires: yup.array()
    .of(
      yup.object().shape({
        format_id: yup.number()
          .required('L\'identifiant du format est requis')
          .integer('L\'identifiant du format doit être un nombre entier')
          .positive('L\'identifiant du format doit être positif'),
        
        emplacement: yup.string()
          .nullable()
          .max(255, 'L\'emplacement ne peut pas dépasser 255 caractères'),
        
        notes: yup.string()
          .nullable()
      })
    )
    .min(0, 'Les exemplaires doivent être un tableau d\'objets')
});

/**
 * Validate film data
 * @param {Object} data - Film data to validate
 * @returns {Promise<Object>} Validated data
 * @throws {Error} Validation error
 */
const validateFilm = async (data) => {
  try {
    return await filmSchema.validate(data, { abortEarly: false });
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
  filmSchema,
  validateFilm
};