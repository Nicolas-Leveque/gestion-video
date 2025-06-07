import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // In a real implementation, this would fetch data from the Electron backend
    // For now, we'll just simulate loading
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setFilms([]);
      setCategories([]);
      setLoading(false);
    }, 500);
    
    // In a real implementation, this would be:
    // window.api.invoke('film:getAll').then(data => {
    //   setFilms(data);
    //   setLoading(false);
    // }).catch(err => {
    //   setError(err.message);
    //   setLoading(false);
    // });
    
    // window.api.invoke('category:getAll').then(data => {
    //   setCategories(data);
    // }).catch(err => {
    //   console.error('Failed to load categories:', err);
    // });
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  // Filter films based on search term and selected category
  const filteredFilms = films.filter(film => {
    const matchesSearch = film.titre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || film.categories.some(cat => cat.id.toString() === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  return (
    <div>
      <div className="filters">
        <input
          type="text"
          placeholder="Rechercher un film..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="category-select"
        >
          <option value="">Toutes les catégories</option>
          {categories.map(category => (
            <option key={category.id} value={category.id.toString()}>
              {category.nom}
            </option>
          ))}
        </select>
      </div>

      {filteredFilms.length === 0 ? (
        <div className="no-films">
          <p>Aucun film trouvé. Commencez par en ajouter un!</p>
          <Link to="/add-film" className="btn btn-primary">
            Ajouter un film
          </Link>
        </div>
      ) : (
        <div className="film-grid">
          {filteredFilms.map(film => (
            <Link to={`/film/${film.id}`} key={film.id} className="film-card">
              <img 
                src={film.chemin_affiche || '/placeholder.jpg'} 
                alt={film.titre} 
              />
              <div className="film-card-content">
                <h3>{film.titre}</h3>
                <p>{film.annee_sortie}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;