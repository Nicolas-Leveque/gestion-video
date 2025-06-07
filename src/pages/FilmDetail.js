import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const FilmDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [film, setFilm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // In a real implementation, this would fetch data from the Electron backend
    // For now, we'll just simulate loading
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setFilm(null);
      setLoading(false);
      setError('Film non trouvé. Cette erreur est normale car nous n\'avons pas encore implémenté la base de données.');
    }, 500);
    
    // In a real implementation, this would be:
    // window.api.invoke('film:get', id).then(data => {
    //   if (data) {
    //     setFilm(data);
    //   } else {
    //     setError('Film non trouvé');
    //   }
    //   setLoading(false);
    // }).catch(err => {
    //   setError(err.message);
    //   setLoading(false);
    // });
  }, [id]);

  const handleDelete = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce film ?')) {
      // In a real implementation, this would delete the film via the Electron backend
      // window.api.send('film:delete', id);
      
      // Redirect to home page
      navigate('/');
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return (
      <div>
        <p>Erreur: {error}</p>
        <Link to="/" className="btn btn-primary">Retour à l'accueil</Link>
      </div>
    );
  }

  if (!film) {
    return (
      <div>
        <p>Film non trouvé</p>
        <Link to="/" className="btn btn-primary">Retour à l'accueil</Link>
      </div>
    );
  }

  return (
    <div className="film-detail">
      <div className="film-detail-header">
        <div className="film-poster">
          <img 
            src={film.chemin_affiche || '/placeholder.jpg'} 
            alt={film.titre} 
          />
        </div>
        <div className="film-info">
          <h1>{film.titre} ({film.annee_sortie})</h1>
          <p><strong>Réalisateur:</strong> {film.realisateur}</p>
          <p><strong>Durée:</strong> {film.duree} minutes</p>
          <p><strong>Catégories:</strong> {film.categories.map(cat => cat.nom).join(', ')}</p>
          
          <div className="film-actions">
            <Link to={`/edit-film/${film.id}`} className="btn btn-primary">
              Modifier
            </Link>
            <button onClick={handleDelete} className="btn btn-danger">
              Supprimer
            </button>
          </div>
        </div>
      </div>
      
      <div className="film-synopsis">
        <h2>Synopsis</h2>
        <p>{film.synopsis}</p>
      </div>
      
      <div className="film-exemplaires">
        <h2>Exemplaires</h2>
        {film.exemplaires && film.exemplaires.length > 0 ? (
          <ul className="exemplaires-list">
            {film.exemplaires.map(exemplaire => (
              <li key={exemplaire.id}>
                <span className="format-badge">{exemplaire.format.nom}</span>
                {exemplaire.emplacement && (
                  <span className="emplacement">Emplacement: {exemplaire.emplacement}</span>
                )}
                {exemplaire.notes && (
                  <p className="notes">{exemplaire.notes}</p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucun exemplaire disponible</p>
        )}
      </div>
    </div>
  );
};

export default FilmDetail;