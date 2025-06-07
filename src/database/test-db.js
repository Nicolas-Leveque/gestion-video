const { sequelize, Film, Category, Format, Exemplaire } = require('./models');
const { initDatabase, insertInitialData } = require('./init-db');

async function testDatabase() {
  try {
    // Test connection
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');

    // Initialize database (create tables)
    await initDatabase();
    console.log('Database tables created successfully.');

    // Insert initial data
    await insertInitialData();
    console.log('Initial data inserted successfully.');

    // Test retrieving categories
    const categories = await Category.findAll();
    console.log(`Retrieved ${categories.length} categories:`);
    categories.forEach(category => {
      console.log(`- ${category.nom}`);
    });

    // Test retrieving formats
    const formats = await Format.findAll();
    console.log(`\nRetrieved ${formats.length} formats:`);
    formats.forEach(format => {
      console.log(`- ${format.nom}`);
    });

    // Test creating a film
    const newFilm = await Film.create({
      titre: 'Test Film',
      annee_sortie: 2023,
      realisateur: 'Test Director',
      duree: 120,
      synopsis: 'This is a test film created to verify the database setup.'
    });
    console.log(`\nCreated new film: ${newFilm.titre} (ID: ${newFilm.id})`);

    // Add categories to the film
    if (categories.length > 0) {
      await newFilm.addCategories([categories[0].id, categories[1].id]);
      console.log(`Added categories to the film: ${categories[0].nom}, ${categories[1].nom}`);
    }

    // Add an exemplaire to the film
    if (formats.length > 0) {
      const newExemplaire = await Exemplaire.create({
        film_id: newFilm.id,
        format_id: formats[0].id,
        emplacement: 'Test Location',
        notes: 'Test exemplaire'
      });
      console.log(`Added exemplaire with format ${formats[0].nom} to the film`);
    }

    // Test retrieving the film with its associations
    const retrievedFilm = await Film.findByPk(newFilm.id, {
      include: [
        { model: Category, as: 'categories' },
        { model: Exemplaire, as: 'exemplaires', include: [{ model: Format, as: 'format' }] }
      ]
    });

    console.log('\nRetrieved film with associations:');
    console.log(`- Title: ${retrievedFilm.titre}`);
    console.log(`- Year: ${retrievedFilm.annee_sortie}`);
    console.log(`- Director: ${retrievedFilm.realisateur}`);
    console.log(`- Categories: ${retrievedFilm.categories.map(c => c.nom).join(', ')}`);
    console.log(`- Exemplaires: ${retrievedFilm.exemplaires.length}`);
    retrievedFilm.exemplaires.forEach(ex => {
      console.log(`  * Format: ${ex.format.nom}, Location: ${ex.emplacement}`);
    });

    console.log('\nDatabase tests completed successfully!');
    return true;
  } catch (error) {
    console.error('Error testing database:', error);
    return false;
  }
}

// Run the test if this script is executed directly
if (require.main === module) {
  testDatabase().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { testDatabase };