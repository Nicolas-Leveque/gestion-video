#!/usr/bin/env node

const { initDatabase, insertInitialData } = require('./init-db');
const { testDatabase } = require('./test-db');

async function setupDatabase() {
  console.log('=== Setting up the database ===');

  console.log('\n1. Initializing database...');
  const dbInitialized = await initDatabase();
  if (!dbInitialized) {
    console.error('Failed to initialize database.');
    // Only exit if running as a script, not when imported as a module
    if (require.main === module) {
      process.exit(1);
    }
    return false;
  }

  console.log('\n2. Inserting initial data...');
  const dataInserted = await insertInitialData();
  if (!dataInserted) {
    console.error('Failed to insert initial data.');
    // Only exit if running as a script, not when imported as a module
    if (require.main === module) {
      process.exit(1);
    }
    return false;
  }

  console.log('\n3. Running database tests...');
  const testsSuccessful = await testDatabase();
  if (!testsSuccessful) {
    console.error('Database tests failed.');
    // Only exit if running as a script, not when imported as a module
    if (require.main === module) {
      process.exit(1);
    }
    return false;
  }

  console.log('\n=== Database setup completed successfully! ===');
  // Only exit if running as a script, not when imported as a module
  if (require.main === module) {
    process.exit(0);
  }
  return true;
}

// Run the setup if this script is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase };
