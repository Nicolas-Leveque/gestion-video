import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
  return (
    <header className="App-header">
      <h1>Gestion Vidéo</h1>
      <nav>
        <NavLink to="/" end>Accueil</NavLink>
        <NavLink to="/add-film">Ajouter un film</NavLink>
        <NavLink to="/categories">Catégories</NavLink>
        <NavLink to="/formats">Formats</NavLink>
      </nav>
    </header>
  );
};

export default Header;