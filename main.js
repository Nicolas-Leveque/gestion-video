const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const { setupDatabase } = require('./src/database/setup');
const { registerDatabaseHandlers } = require('./src/ipc/database-handlers');
const { registerPosterHandlers } = require('./src/ipc/poster-handlers');

// Keep a global reference of the window object to prevent it from being garbage collected
let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Load the index.html from the React app
  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, './build/index.html'),
    protocol: 'file:',
    slashes: true
  });

  mainWindow.loadURL(startUrl);

  // Open the DevTools in development mode
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  // Emitted when the window is closed
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

// Create window when Electron is ready
app.whenReady()
  .then(() => {
    // Initialize the database
    return setupDatabase().catch(err => {
      console.error('Failed to set up database:', err);
      // Continue with application startup even if database setup fails
    });
  })
  .then(() => {
    // Register IPC handlers for database operations
    registerDatabaseHandlers();
    // Register IPC handlers for poster management
    registerPosterHandlers();
  })
  .then(createWindow);

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  // On macOS, re-create a window when the dock icon is clicked and no other windows are open
  if (mainWindow === null) createWindow();
});

// IPC handlers will be added here for communication between main and renderer processes
