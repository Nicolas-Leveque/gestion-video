import React, { useState, useEffect } from 'react';

const Formats = () => {
  const [formats, setFormats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newFormat, setNewFormat] = useState('');
  const [editingFormat, setEditingFormat] = useState(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    // In a real implementation, this would fetch data from the Electron backend
    // For now, we'll just simulate loading
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setFormats([]);
      setLoading(false);
    }, 500);
    
    // In a real implementation, this would be:
    // window.api.invoke('format:getAll').then(data => {
    //   setFormats(data);
    //   setLoading(false);
    // }).catch(err => {
    //   setError(err.message);
    //   setLoading(false);
    // });
  }, []);

  const handleAddFormat = (e) => {
    e.preventDefault();
    
    if (!newFormat.trim()) {
      return;
    }
    
    // In a real implementation, this would add the format via the Electron backend
    // window.api.invoke('format:create', { nom: newFormat }).then(newFmt => {
    //   setFormats(prev => [...prev, newFmt]);
    //   setNewFormat('');
    // }).catch(err => {
    //   setError(err.message);
    // });
    
    // For now, just simulate adding
    const newFmt = {
      id: Date.now(), // Use timestamp as temporary ID
      nom: newFormat
    };
    setFormats(prev => [...prev, newFmt]);
    setNewFormat('');
  };

  const startEditing = (format) => {
    setEditingFormat(format.id);
    setEditName(format.nom);
  };

  const cancelEditing = () => {
    setEditingFormat(null);
    setEditName('');
  };

  const handleUpdateFormat = (e, id) => {
    e.preventDefault();
    
    if (!editName.trim()) {
      return;
    }
    
    // In a real implementation, this would update the format via the Electron backend
    // window.api.invoke('format:update', { id, nom: editName }).then(() => {
    //   setFormats(prev => prev.map(fmt => 
    //     fmt.id === id ? { ...fmt, nom: editName } : fmt
    //   ));
    //   setEditingFormat(null);
    //   setEditName('');
    // }).catch(err => {
    //   setError(err.message);
    // });
    
    // For now, just simulate updating
    setFormats(prev => prev.map(fmt => 
      fmt.id === id ? { ...fmt, nom: editName } : fmt
    ));
    setEditingFormat(null);
    setEditName('');
  };

  const handleDeleteFormat = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce format ?')) {
      // In a real implementation, this would delete the format via the Electron backend
      // window.api.invoke('format:delete', id).then(() => {
      //   setFormats(prev => prev.filter(fmt => fmt.id !== id));
      // }).catch(err => {
      //   setError(err.message);
      // });
      
      // For now, just simulate deleting
      setFormats(prev => prev.filter(fmt => fmt.id !== id));
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
      <h1>Gestion des formats</h1>
      
      <form onSubmit={handleAddFormat} className="add-form">
        <div className="form-group">
          <label htmlFor="newFormat">Nouveau format</label>
          <div className="input-group">
            <input
              type="text"
              id="newFormat"
              value={newFormat}
              onChange={(e) => setNewFormat(e.target.value)}
              placeholder="Nom du format (DVD, Blu-ray, etc.)"
            />
            <button type="submit" className="btn btn-primary">Ajouter</button>
          </div>
        </div>
      </form>
      
      {formats.length === 0 ? (
        <p>Aucun format disponible. Ajoutez-en un!</p>
      ) : (
        <ul className="formats-list">
          {formats.map(format => (
            <li key={format.id} className="format-item">
              {editingFormat === format.id ? (
                <form onSubmit={(e) => handleUpdateFormat(e, format.id)} className="edit-form">
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
                  <span className="format-name">{format.nom}</span>
                  <div className="button-group">
                    <button 
                      onClick={() => startEditing(format)}
                      className="btn btn-secondary btn-sm"
                    >
                      Modifier
                    </button>
                    <button 
                      onClick={() => handleDeleteFormat(format.id)}
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

export default Formats;