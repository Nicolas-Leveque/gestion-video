# Database Layer

This directory contains the database layer for the video library management application.

## Structure

- `init-db.js`: Script to initialize the SQLite database, create tables, and insert initial data
- `test-db.js`: Script to test the database setup and verify that everything works correctly
- `setup.js`: Script to set up the database (initialize, insert initial data, run tests)
- `models/`: Directory containing Sequelize models for each entity
  - `Film.js`: Model for films
  - `Category.js`: Model for categories (genres)
  - `Format.js`: Model for formats (DVD, Blu-ray, etc.)
  - `Exemplaire.js`: Model for exemplaires (copies of films in specific formats)
  - `index.js`: Defines associations between models and exports them
- `dao/`: Directory containing Data Access Objects (DAOs) for each entity
  - `FilmDAO.js`: DAO for films
  - `CategoryDAO.js`: DAO for categories
  - `FormatDAO.js`: DAO for formats
  - `ExemplaireDAO.js`: DAO for exemplaires
  - `index.js`: Exports all DAOs

## Database Schema

The database consists of the following tables:

### films
- `id`: Primary key
- `titre`: Film title (required)
- `annee_sortie`: Release year (required)
- `realisateur`: Director
- `duree`: Duration in minutes
- `synopsis`: Synopsis text
- `chemin_affiche`: Path to the poster image
- `date_ajout`: Date when the film was added to the database

### categories
- `id`: Primary key
- `nom`: Category name (required, unique)

### formats
- `id`: Primary key
- `nom`: Format name (required, unique)

### film_categories
- `film_id`: Foreign key to films
- `categorie_id`: Foreign key to categories
- Primary key is the combination of film_id and categorie_id

### exemplaires
- `id`: Primary key
- `film_id`: Foreign key to films (required)
- `format_id`: Foreign key to formats (required)
- `emplacement`: Physical or digital location
- `notes`: Additional notes

## Usage

### Initializing the Database

To initialize the database, run:

```javascript
const { initDatabase, insertInitialData } = require('./database/init-db');

async function setup() {
  await initDatabase();
  await insertInitialData();
}

setup();
```

### Working with Models

Import the models from the index file:

```javascript
const { Film, Category, Format, Exemplaire } = require('./database/models');
```

#### Creating a Film

```javascript
const newFilm = await Film.create({
  titre: 'Film Title',
  annee_sortie: 2023,
  realisateur: 'Director Name',
  duree: 120,
  synopsis: 'Film synopsis'
});
```

#### Adding Categories to a Film

```javascript
// Get categories
const categories = await Category.findAll({
  where: {
    nom: ['Action', 'Adventure']
  }
});

// Add categories to film
await newFilm.addCategories(categories.map(c => c.id));
```

#### Adding an Exemplaire to a Film

```javascript
// Get a format
const format = await Format.findOne({
  where: {
    nom: 'DVD'
  }
});

// Create an exemplaire
await Exemplaire.create({
  film_id: newFilm.id,
  format_id: format.id,
  emplacement: 'Shelf A',
  notes: 'Good condition'
});
```

#### Retrieving a Film with Associations

```javascript
const film = await Film.findByPk(filmId, {
  include: [
    { model: Category, as: 'categories' },
    { 
      model: Exemplaire, 
      as: 'exemplaires', 
      include: [{ model: Format, as: 'format' }] 
    }
  ]
});

console.log(film.titre);
console.log(film.categories.map(c => c.nom).join(', '));
film.exemplaires.forEach(ex => {
  console.log(`Format: ${ex.format.nom}, Location: ${ex.emplacement}`);
});
```

## Data Access Objects (DAOs)

The DAO layer provides a clean interface for interacting with the database. Each DAO provides methods for CRUD operations and more complex queries.

### Using the DAOs

Import the DAOs from the index file:

```javascript
const { FilmDAO, CategoryDAO, FormatDAO, ExemplaireDAO } = require('./database/dao');
```

### FilmDAO

```javascript
// Create a film
const newFilm = await FilmDAO.createFilm({
  titre: 'Inception',
  annee_sortie: 2010,
  realisateur: 'Christopher Nolan',
  duree: 148,
  synopsis: 'A thief who steals corporate secrets through the use of dream-sharing technology...',
  categories: [1, 9], // Action, Science-fiction
  exemplaires: [
    { format_id: 2, emplacement: 'Étagère A', notes: 'Édition spéciale' }
  ]
});

// Get a film by ID
const film = await FilmDAO.getFilmById(1);

// Get all films
const films = await FilmDAO.getAllFilms();

// Search films
const actionFilms = await FilmDAO.searchFilms({
  categories: [1], // Action
  annee_min: 2000,
  annee_max: 2020
});

// Update a film
await FilmDAO.updateFilm(1, {
  titre: 'Inception (Director\'s Cut)',
  exemplaires: [
    { format_id: 2, emplacement: 'Étagère A', notes: 'Édition spéciale' },
    { format_id: 3, emplacement: 'Étagère B', notes: '4K UHD' }
  ]
});

// Delete a film
await FilmDAO.deleteFilm(1);
```

### CategoryDAO

```javascript
// Create a category
const newCategory = await CategoryDAO.createCategory({ nom: 'Animation Japonaise' });

// Get all categories
const categories = await CategoryDAO.getAllCategories();

// Get categories with film count
const categoriesWithCount = await CategoryDAO.getCategoriesWithFilmCount();
```

### FormatDAO

```javascript
// Create a format
const newFormat = await FormatDAO.createFormat({ nom: 'Blu-ray 3D' });

// Get all formats
const formats = await FormatDAO.getAllFormats();

// Get formats with exemplaire count
const formatsWithCount = await FormatDAO.getFormatsWithExemplaireCount();
```

### ExemplaireDAO

```javascript
// Create an exemplaire
const newExemplaire = await ExemplaireDAO.createExemplaire({
  film_id: 1,
  format_id: 2,
  emplacement: 'Étagère C',
  notes: 'Bon état'
});

// Get exemplaires for a film
const exemplaires = await ExemplaireDAO.getExemplairesByFilmId(1);
```

## Testing

To test the database setup, run:

```javascript
const { testDatabase } = require('./database/test-db');

testDatabase().then(success => {
  console.log(success ? 'Tests passed!' : 'Tests failed!');
});
```

You can also use the setup script:

```bash
npm run setup-db
```
