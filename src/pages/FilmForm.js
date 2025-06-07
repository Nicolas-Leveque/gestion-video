import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const FilmForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [loading, setLoading] = useState(isEditMode);
  const [categories, setCategories] = useState([]);
  const [formats, setFormats] = useState([]);
  const [formData, setFormData] = useState({
    titre: '',
    annee_sortie: new Date().getFullYear(),
    realisateur: '',
    duree: '',
    synopsis: '',
    categories: [],
    exemplaires: []
  });
  const [poster, setPoster] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Load categories and formats
    // In a real implementation, this would fetch data from the Electron backend
    // For now, we'll just simulate loading with empty arrays
    
    // Simulate API calls
    setTimeout(() => {
      setCategories([]);
      setFormats([]);
      
      // If in edit mode, load film data
      if (isEditMode) {
        setFormData({
          titre: '',
          annee_sortie: new Date().getFullYear(),
          realisateur: '',
          duree: '',
          synopsis: '',
          categories: [],
          exemplaires: []
        });
        setLoading(false);
      }
    }, 500);
    
    // In a real implementation, this would be:
    // Promise.all([
    //   window.api.invoke('category:getAll'),
    //   window.api.invoke('format:getAll')
    // ]).then(([categoriesData, formatsData]) => {
    //   setCategories(categoriesData);
    //   setFormats(formatsData);
    //   
    //   if (isEditMode) {
    //     return window.api.invoke('film:get', id);
    //   }
    // }).then(filmData => {
    //   if (filmData) {
    //     setFormData({
    //       ...filmData,
    //       categories: filmData.categories.map(c => c.id)
    //     });
    //   }
    //   setLoading(false);
    // }).catch(err => {
    //   console.error('Error loading data:', err);
    //   setLoading(false);
    // });
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (e) => {
    const categoryId = parseInt(e.target.value);
    const isChecked = e.target.checked;
    
    setFormData(prev => {
      if (isChecked) {
        return {
          ...prev,
          categories: [...prev.categories, categoryId]
        };
      } else {
        return {
          ...prev,
          categories: prev.categories.filter(id => id !== categoryId)
        };
      }
    });
  };

  const handlePosterChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPoster(e.target.files[0]);
    }
  };

  const addExemplaire = () => {
    setFormData(prev => ({
      ...prev,
      exemplaires: [
        ...prev.exemplaires,
        { format_id: '', emplacement: '', notes: '' }
      ]
    }));
  };

  const updateExemplaire = (index, field, value) => {
    setFormData(prev => {
      const updatedExemplaires = [...prev.exemplaires];
      updatedExemplaires[index] = {
        ...updatedExemplaires[index],
        [field]: value
      };
      return {
        ...prev,
        exemplaires: updatedExemplaires
      };
    });
  };

  const removeExemplaire = (index) => {
    setFormData(prev => ({
      ...prev,
      exemplaires: prev.exemplaires.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.titre.trim()) {
      newErrors.titre = 'Le titre est requis';
    }
    
    if (!formData.annee_sortie) {
      newErrors.annee_sortie = 'L\'année de sortie est requise';
    } else if (formData.annee_sortie < 1800 || formData.annee_sortie > new Date().getFullYear() + 5) {
      newErrors.annee_sortie = 'L\'année de sortie doit être valide';
    }
    
    if (formData.duree && (isNaN(formData.duree) || formData.duree <= 0)) {
      newErrors.duree = 'La durée doit être un nombre positif';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // In a real implementation, this would save the film via the Electron backend
    // const filmData = { ...formData };
    // 
    // if (poster) {
    //   // In a real implementation, this would upload the poster
    //   // filmData.poster = poster;
    // }
    // 
    // const channel = isEditMode ? 'film:update' : 'film:create';
    // window.api.invoke(channel, filmData).then(() => {
    //   navigate('/');
    // }).catch(err => {
    //   console.error('Error saving film:', err);
    // });
    
    // For now, just navigate back to home
    navigate('/');
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <h1>{isEditMode ? 'Modifier le film' : 'Ajouter un film'}</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="titre">Titre</label>
          <input
            type="text"
            id="titre"
            name="titre"
            value={formData.titre}
            onChange={handleChange}
            className={errors.titre ? 'error' : ''}
          />
          {errors.titre && <div className="error-message">{errors.titre}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="annee_sortie">Année de sortie</label>
          <input
            type="number"
            id="annee_sortie"
            name="annee_sortie"
            value={formData.annee_sortie}
            onChange={handleChange}
            className={errors.annee_sortie ? 'error' : ''}
          />
          {errors.annee_sortie && <div className="error-message">{errors.annee_sortie}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="realisateur">Réalisateur</label>
          <input
            type="text"
            id="realisateur"
            name="realisateur"
            value={formData.realisateur}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="duree">Durée (minutes)</label>
          <input
            type="number"
            id="duree"
            name="duree"
            value={formData.duree}
            onChange={handleChange}
            className={errors.duree ? 'error' : ''}
          />
          {errors.duree && <div className="error-message">{errors.duree}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="synopsis">Synopsis</label>
          <textarea
            id="synopsis"
            name="synopsis"
            value={formData.synopsis}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="poster">Affiche</label>
          <input
            type="file"
            id="poster"
            accept="image/*"
            onChange={handlePosterChange}
          />
          {isEditMode && formData.chemin_affiche && (
            <div className="current-poster">
              <p>Affiche actuelle:</p>
              <img 
                src={formData.chemin_affiche} 
                alt="Affiche actuelle" 
                style={{ maxWidth: '200px' }}
              />
            </div>
          )}
        </div>
        
        <div className="form-group">
          <label>Catégories</label>
          <div className="categories-checkboxes">
            {categories.length === 0 ? (
              <p>Aucune catégorie disponible</p>
            ) : (
              categories.map(category => (
                <div key={category.id} className="category-checkbox">
                  <input
                    type="checkbox"
                    id={`category-${category.id}`}
                    value={category.id}
                    checked={formData.categories.includes(category.id)}
                    onChange={handleCategoryChange}
                  />
                  <label htmlFor={`category-${category.id}`}>{category.nom}</label>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="form-group">
          <label>Exemplaires</label>
          <button type="button" onClick={addExemplaire} className="btn btn-secondary">
            Ajouter un exemplaire
          </button>
          
          {formData.exemplaires.map((exemplaire, index) => (
            <div key={index} className="exemplaire-item">
              <div className="exemplaire-header">
                <h4>Exemplaire #{index + 1}</h4>
                <button 
                  type="button" 
                  onClick={() => removeExemplaire(index)}
                  className="btn btn-danger btn-sm"
                >
                  Supprimer
                </button>
              </div>
              
              <div className="form-group">
                <label>Format</label>
                <select
                  value={exemplaire.format_id}
                  onChange={(e) => updateExemplaire(index, 'format_id', e.target.value)}
                >
                  <option value="">Sélectionner un format</option>
                  {formats.map(format => (
                    <option key={format.id} value={format.id}>
                      {format.nom}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Emplacement</label>
                <input
                  type="text"
                  value={exemplaire.emplacement}
                  onChange={(e) => updateExemplaire(index, 'emplacement', e.target.value)}
                  placeholder="Étagère, boîte, etc."
                />
              </div>
              
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={exemplaire.notes}
                  onChange={(e) => updateExemplaire(index, 'notes', e.target.value)}
                  placeholder="État, particularités, etc."
                />
              </div>
            </div>
          ))}
          
          {formData.exemplaires.length === 0 && (
            <p>Aucun exemplaire ajouté</p>
          )}
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {isEditMode ? 'Mettre à jour' : 'Ajouter'}
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/')}
            className="btn btn-secondary"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default FilmForm;