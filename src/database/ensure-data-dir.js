const fs = require('fs');
const path = require('path');

/**
 * Ensure that the data directory exists and has the correct permissions
 * @returns {string} Path to the data directory
 */
function ensureDataDirectory() {
  // Get the path to the data directory
  const dataDir = path.join(__dirname, '../../data');
  
  // Create the directory if it doesn't exist
  if (!fs.existsSync(dataDir)) {
    console.log(`Creating data directory: ${dataDir}`);
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // Ensure the directory has the correct permissions
  try {
    fs.accessSync(dataDir, fs.constants.R_OK | fs.constants.W_OK);
  } catch (err) {
    console.error(`Error: Data directory ${dataDir} is not readable/writable:`, err);
    throw err;
  }
  
  console.log(`Data directory is ready: ${dataDir}`);
  return dataDir;
}

/**
 * Ensure that the database file has the correct permissions
 * @param {string} dbPath - Path to the database file
 * @returns {boolean} True if the database file is accessible
 */
function ensureDatabaseFileAccess(dbPath) {
  // Check if the database file exists
  if (fs.existsSync(dbPath)) {
    try {
      // Check if the file is readable and writable
      fs.accessSync(dbPath, fs.constants.R_OK | fs.constants.W_OK);
      console.log(`Database file is accessible: ${dbPath}`);
      return true;
    } catch (err) {
      console.error(`Error: Database file ${dbPath} is not readable/writable:`, err);
      throw err;
    }
  }
  
  // If the file doesn't exist, that's fine - it will be created
  console.log(`Database file does not exist yet: ${dbPath}`);
  return true;
}

module.exports = {
  ensureDataDirectory,
  ensureDatabaseFileAccess
};