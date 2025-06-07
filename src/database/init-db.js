const { Sequelize } = require('sequelize');
const path = require('path');
const { ensureDataDirectory, ensureDatabaseFileAccess } = require('./ensure-data-dir');

// Ensure the data directory exists and has the correct permissions
const dbDir = ensureDataDirectory();

// Define the database file path
const dbPath = path.join(dbDir, 'database.sqlite');

// Ensure the database file is accessible (if it exists)
ensureDatabaseFileAccess(dbPath);

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: console.log
});

// Test the connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return false;
  }
}

// Initialize the database
async function initDatabase() {
  try {
    // Create tables
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS films (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titre VARCHAR(255) NOT NULL,
        annee_sortie INTEGER NOT NULL,
        realisateur VARCHAR(255),
        duree INTEGER,
        synopsis TEXT,
        chemin_affiche VARCHAR(255),
        date_ajout DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nom VARCHAR(100) NOT NULL UNIQUE
      );
    `);

    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS formats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nom VARCHAR(50) NOT NULL UNIQUE
      );
    `);

    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS film_categories (
        film_id INTEGER,
        categorie_id INTEGER,
        PRIMARY KEY (film_id, categorie_id),
        FOREIGN KEY (film_id) REFERENCES films(id) ON DELETE CASCADE,
        FOREIGN KEY (categorie_id) REFERENCES categories(id) ON DELETE CASCADE
      );
    `);

    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS exemplaires (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        film_id INTEGER NOT NULL,
        format_id INTEGER NOT NULL,
        emplacement VARCHAR(255),
        notes TEXT,
        FOREIGN KEY (film_id) REFERENCES films(id) ON DELETE CASCADE,
        FOREIGN KEY (format_id) REFERENCES formats(id) ON DELETE CASCADE
      );
    `);

    console.log('Database tables created successfully.');
    return true;
  } catch (error) {
    console.error('Error creating database tables:', error);
    return false;
  }
}

// Insert initial data
async function insertInitialData() {
  try {
    // Insert categories
    await sequelize.query(`
      INSERT INTO categories (nom) VALUES 
      ('Action'), ('Aventure'), ('Animation'), ('Comédie'), 
      ('Documentaire'), ('Drame'), ('Fantastique'), ('Horreur'), 
      ('Science-fiction'), ('Thriller'), ('Romance'), ('Historique');
    `);

    // Insert formats
    await sequelize.query(`
      INSERT INTO formats (nom) VALUES 
      ('DVD'), ('Blu-ray'), ('Blu-ray 4K'), ('Numérique HD'), ('Numérique SD');
    `);

    console.log('Initial data inserted successfully.');
    return true;
  } catch (error) {
    console.error('Error inserting initial data:', error);
    return false;
  }
}

// Main function to initialize the database
async function main() {
  const connected = await testConnection();
  if (!connected) {
    process.exit(1);
  }

  const tablesCreated = await initDatabase();
  if (!tablesCreated) {
    process.exit(1);
  }

  const dataInserted = await insertInitialData();
  if (!dataInserted) {
    process.exit(1);
  }

  console.log('Database initialization completed successfully.');
  process.exit(0);
}

// Run the main function if this script is executed directly
if (require.main === module) {
  main();
}

module.exports = {
  sequelize,
  testConnection,
  initDatabase,
  insertInitialData
};
