// Путь: server.js

import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { db } from './src/server/db/config.js';
import fs from 'fs';

// Импорт маршрутов
import recipeRoutes from './src/server/routes/recipeRoutes.js';
import cafeRoutes from './src/server/routes/cafeRoutes.js';
import cozyRoutes from './src/server/routes/cozyRoutes.js';
import diaryRoutes from './src/server/routes/diaryRoutes.js';
// Добавляем импорт mainRoutes
import mainRoutes from './src/server/routes/mainRoutes.js';

// Импорт middleware
import { errorHandler, notFound } from './src/server/middleware/errorMiddleware.js';

// Импорт Swagger
import { setupSwagger } from './src/server/config/swagger.js';

// Импорт инициализации базы данных
import { initializeDatabase } from './src/server/db/init.js';

// Получение __dirname в среде ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Настройка Swagger
setupSwagger(app);

// Инициализация базы данных
initializeDatabase().catch(console.error);

// Регистрация маршрутов - здесь важен порядок

// Сначала обслуживаем статические файлы для клиентской части (если они есть)
app.use(express.static(join(__dirname, 'dist')));

// API маршруты
// Добавляем mainRoutes вначале
app.use('/', mainRoutes);

// Затем регистрируем маршруты рецептов
app.use('/', recipeRoutes);

// Затем маршруты для кафе
app.use('/', cafeRoutes);

// Затем маршруты для cozy articles
app.use('/', cozyRoutes);

// Затем маршруты для дневников
app.use('/', diaryRoutes);

// Для всех остальных запросов отправляем index.html (для работы маршрутизации на стороне клиента)
app.get('*', (req, res) => {
  // Проверяем, если запрос для API - возвращаем 404
  if (req.originalUrl.startsWith('/api/')) {
    return notFound(req, res);
  }

  // В остальных случаях отдаем index.html для поддержки SPA (Single Page Application)
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

// Middleware для обработки ошибок
app.use(notFound);
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
});

// Handle application shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Database connection closed');
    process.exit(0);
  });
});
