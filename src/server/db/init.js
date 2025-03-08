import { db, dbAsync, closeDatabase as closeDbConnection } from './config.js';
import { createTables } from './tables.js';
import { importData } from './import.js';

// Initialize database
export const initializeDatabase = async () => {
  console.log('Initializing database...');

  try {
    await createTables();
    await importData();
    console.log('Database initialization completed');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Close database connection
export const closeDatabase = async () => {
  console.log('Closing database connection...');
  try {
    await closeDbConnection();
    console.log('Database connection closed');
    return true;
  } catch (error) {
    console.error('Error closing database connection:', error);
    throw error;
  }
};

// Export database objects for use in controllers
export { db, dbAsync };
