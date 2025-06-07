# IPC (Inter-Process Communication)

This directory contains handlers for IPC (Inter-Process Communication) between the Electron main process and the renderer process (React application).

## Database Handlers

The `database-handlers.js` file registers IPC handlers for database operations. These handlers allow the React application to interact with the database through the Electron main process.

### How it works

1. The main process registers IPC handlers for various database operations using `ipcMain.handle()`.
2. The preload script exposes these handlers to the renderer process using `contextBridge.exposeInMainWorld()`.
3. The React application can then call these handlers using `window.api.invoke()`.

### Handler Registration

The handlers are registered in the main process when the application starts:

```javascript
// In main.js
const { registerDatabaseHandlers } = require('./src/ipc/database-handlers');

app.whenReady()
  .then(() => {
    // Initialize the database
    return setupDatabase().catch(err => {
      console.error('Failed to set up database:', err);
    });
  })
  .then(() => {
    // Register IPC handlers for database operations
    registerDatabaseHandlers();
  })
  .then(createWindow);
```

### Available Handlers

The following IPC handlers are available:

#### Film Handlers
- `film:get`: Get a film by ID
- `film:getAll`: Get all films
- `film:search`: Search for films
- `film:create`: Create a new film
- `film:update`: Update a film
- `film:delete`: Delete a film

#### Category Handlers
- `category:get`: Get a category by ID
- `category:getAll`: Get all categories
- `category:getWithFilmCount`: Get categories with film count
- `category:create`: Create a new category
- `category:update`: Update a category
- `category:delete`: Delete a category

#### Format Handlers
- `format:get`: Get a format by ID
- `format:getAll`: Get all formats
- `format:getWithExemplaireCount`: Get formats with exemplaire count
- `format:create`: Create a new format
- `format:update`: Update a format
- `format:delete`: Delete a format

#### Exemplaire Handlers
- `exemplaire:get`: Get an exemplaire by ID
- `exemplaire:getAll`: Get all exemplaires
- `exemplaire:getByFilm`: Get exemplaires by film ID
- `exemplaire:getByFormat`: Get exemplaires by format ID
- `exemplaire:create`: Create a new exemplaire
- `exemplaire:update`: Update an exemplaire
- `exemplaire:delete`: Delete an exemplaire

### Error Handling

All handlers include error handling to ensure that errors are properly logged and propagated to the renderer process. This allows the React application to display appropriate error messages to the user.

### Usage in React

Instead of using these handlers directly, it's recommended to use the utility functions provided in `src/utils/database.js`. These functions provide a cleaner interface for interacting with the database from React components.

```javascript
import { FilmAPI } from '../utils/database';

// Get all films
const films = await FilmAPI.getAllFilms();

// Create a new film
const newFilm = await FilmAPI.createFilm({
  titre: 'Inception',
  annee_sortie: 2010,
  realisateur: 'Christopher Nolan'
});
```

See the [utils/README.md](../utils/README.md) for more information on using the database utility functions.