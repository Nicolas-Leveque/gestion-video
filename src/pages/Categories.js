import React, { useState, useEffect } from 'react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    // In a real implementation, this would fetch data from the Electron backend
    // For now, we'll just simulate loading
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setCategories([]);
      setLoading(false);
    }, 500);
    
    // In a real implementation, this would be:
    // window.api.invoke('category:getAll').then(data => {
    //   setCategories(data);
    //   setLoading(false);
    // }).catch(err => {
    //   setError(err.message);
    //   setLoading(false);
    // });
  }, []);

  const handleAddCategory = (e) => {
    e.preventDefault();
    
    if (!newCategory.trim()) {
      return;
    }
    
    // In a real implementation, this would add the category via the Electron backend
    // window.api.invoke('category:create', { nom: newCategory }).then(newCat => {
    //   setCategories(prev => [...prev, newCat]);
    //   setNewCategory('');
    // }).catch(err => {
    //   setError(err.message);
    // });
    
    // For now, just simulate adding
    const newCat = {
      id: Date.now(), // Use timestamp as temporary ID
      nom: newCategory
    };
    setCategories(prev => [...prev, newCat]);
    setNewCategory('');
  };

  const startEditing = (category) => {
    setEditingCategory(category.id);
    setEditName(category.nom);
  };

  const cancelEditing = () => {
    setEditingCategory(null);
    setEditName('');
  };

  const handleUpdateCategory = (e, id) => {
    e.preventDefault();
    
    if (!editName.trim()) {
      return;
    }
    
    // In a real implementation, this would update the category via the Electron backend
    // window.api.invoke('category:update', { id, nom: editName }).then(() => {
    //   setCategories(prev => prev.map(cat => 
    //     cat.id === id ? { ...cat, nom: editName } : cat
    //   ));
    //   setEditingCategory(null);
    //   setEditName('');
    // }).catch(err => {
    //   setError(err.message);
    // });
    
    // For now, just simulate updating
    setCategories(prev => prev.map(cat => 
      cat.id === id ? { ...cat, nom: editName } : cat
    ));
    setEditingCategory(null);
    setEditName('');
  };

  const handleDeleteCategory = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      // In a real implementation, this would delete the category via the Electron backend
      // window.api.invoke('category:delete', id).then(() => {
      //   setCategories(prev => prev.filter(cat => cat.id !== id));
      // }).catch(err => {
      //   setError(err.message);
      // });
      
      // For now, just simulate deleting
      setCategories(prev => prev.filter(cat => cat.id !== id));
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  return (
    <div>
      <h1>Gestion des catégories</h1>
      
      <form onSubmit={handleAddCategory} className="add-form">
        <div className="form-group">
          <label htmlFor="newCategory">Nouvelle catégorie</label>
          <div className="input-group">
            <input
              type="text"
              id="newCategory"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Nom de la catégorie"
            />
            <button type="submit" className="btn btn-primary">Ajouter</button>
          </div>
        </div>
      </form>
      
      {categories.length === 0 ? (
        <p>Aucune catégorie disponible. Ajoutez-en une!</p>
      ) : (
        <ul className="categories-list">
          {categories.map(category => (
            <li key={category.id} className="category-item">
              {editingCategory === category.id ? (
                <form onSubmit={(e) => handleUpdateCategory(e, category.id)} className="edit-form">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                  <div className="button-group">
                    <button type="submit" className="btn btn-primary btn-sm">Enregistrer</button>
                    <button 
                      type="button" 
                      onClick={cancelEditing}
                      className="btn btn-secondary btn-sm"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <span className="category-name">{category.nom}</span>
                  <div className="button-group">
                    <button 
                      onClick={() => startEditing(category)}
                      className="btn btn-secondary btn-sm"
                    >
                      Modifier
                    </button>
                    <button 
                      onClick={() => handleDeleteCategory(category.id)}
                      className="btn btn-danger btn-sm"
                    >
                      Supprimer
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Categories;