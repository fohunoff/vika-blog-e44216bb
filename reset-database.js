// reset-database.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeDatabase } from './src/server/db/init.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'blog_data.db');

// Удаляем существующую БД, если она существует
if (fs.existsSync(dbPath)) {
    console.log('Removing existing database...');
    fs.unlinkSync(dbPath);
    console.log('Database file removed successfully');
}

// Инициализируем БД заново
console.log('Initializing database...');
initializeDatabase()
    .then(() => {
        console.log('Database successfully reinitialized');
        process.exit(0);
    })
    .catch((err) => {
        console.error('Error initializing database:', err);
        process.exit(1);
    });
