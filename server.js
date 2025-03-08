
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Import route handlers
import recipeRoutes from './src/server/routes/recipeRoutes.js';
import cozyRoutes from './src/server/routes/cozyRoutes.js';
import diaryRoutes from './src/server/routes/diaryRoutes.js';
import cafeRoutes from './src/server/routes/cafeRoutes.js';

// Import middleware
import { errorHandler, notFound } from './src/server/middleware/errorMiddleware.js';

// Import database initialization
import { initializeDatabase, closeDatabase } from './src/server/db/init.js';

// Import Swagger setup
import { setupSwagger } from './src/server/config/swagger.js';

// Set up Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
await initializeDatabase();

// Set up Swagger documentation
setupSwagger(app);

// Root route handler
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to the API',
    documentation: `http://localhost:${PORT}/api-docs`,
    endpoints: {
      recipes: '/recipes',
      cozy: '/cozy',
      diary: '/diary',
      cafes: '/cafes'
    }
  });
});

// API Routes - use order from most specific to least specific
app.use('/', recipeRoutes);
app.use('/', cozyRoutes);
app.use('/', diaryRoutes);
app.use('/', cafeRoutes);

// Handle 404 errors
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
});

// Handle application shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  server.close(() => {
    console.log('Server closed');
  });
  
  try {
    await closeDatabase();
    console.log('Database connection closed');
    process.exit(0);
  } catch (err) {
    console.error('Error closing database:', err.message);
    process.exit(1);
  }
});

export default app;
