# Utilities

This directory contains utility functions and helpers for the application.

## Database Utilities

The `database.js` file provides a clean interface for React components to interact with the database through IPC channels. It abstracts away the details of the IPC communication, making it easy to use the database from the frontend.

### Usage

Import the APIs you need in your React components:

```javascript
import { FilmAPI, CategoryAPI, FormatAPI, ExemplaireAPI } from '../utils/database';
// Or import all APIs
import DatabaseAPI from '../utils/database';
```

### Examples

#### Working with Films

```javascript
import { FilmAPI } from '../utils/database';
import { useEffect, useState } from 'react';

function FilmList() {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch all films when component mounts
    const fetchFilms = async () => {
      try {
        setLoading(true);
        const data = await FilmAPI.getAllFilms();
        setFilms(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchFilms();
  }, []);

  // Search for films
  const searchFilms = async (criteria) => {
    try {
      setLoading(true);
      const data = await FilmAPI.searchFilms(criteria);
      setFilms(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Create a new film
  const addFilm = async (filmData) => {
    try {
      const newFilm = await FilmAPI.createFilm(filmData);
      setFilms(prevFilms => [...prevFilms, newFilm]);
      return newFilm;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  // Update a film
  const updateFilm = async (id, filmData) => {
    try {
      const updatedFilm = await FilmAPI.updateFilm(id, filmData);
      setFilms(prevFilms => 
        prevFilms.map(film => film.id === id ? updatedFilm : film)
      );
      return updatedFilm;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  // Delete a film
  const deleteFilm = async (id) => {
    try {
      await FilmAPI.deleteFilm(id);
      setFilms(prevFilms => prevFilms.filter(film => film.id !== id));
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Render component...
}
```

#### Working with Categories

```javascript
import { CategoryAPI } from '../utils/database';

// Get all categories
const categories = await CategoryAPI.getAllCategories();

// Get categories with film count
const categoriesWithCount = await CategoryAPI.getCategoriesWithFilmCount();

// Create a new category
const newCategory = await CategoryAPI.createCategory({ nom: 'Sci-Fi' });

// Update a category
await CategoryAPI.updateCategory(1, { nom: 'Science Fiction' });

// Delete a category
await CategoryAPI.deleteCategory(1);
```

#### Working with Formats

```javascript
import { FormatAPI } from '../utils/database';

// Get all formats
const formats = await FormatAPI.getAllFormats();

// Create a new format
const newFormat = await FormatAPI.createFormat({ nom: 'Blu-ray 3D' });
```

#### Working with Exemplaires

```javascript
import { ExemplaireAPI } from '../utils/database';

// Get exemplaires for a film
const exemplaires = await ExemplaireAPI.getExemplairesByFilm(1);

// Create a new exemplaire
const newExemplaire = await ExemplaireAPI.createExemplaire({
  film_id: 1,
  format_id: 2,
  emplacement: 'Étagère A',
  notes: 'Édition spéciale'
});
```

### Error Handling

All API methods return promises that can be handled with try/catch blocks or .then()/.catch() chains:

```javascript
try {
  const films = await FilmAPI.getAllFilms();
  // Handle success
} catch (error) {
  // Handle error
  console.error('Failed to fetch films:', error);
}
```

Or using .then()/.catch():

```javascript
FilmAPI.getAllFilms()
  .then(films => {
    // Handle success
  })
  .catch(error => {
    // Handle error
    console.error('Failed to fetch films:', error);
  });
```