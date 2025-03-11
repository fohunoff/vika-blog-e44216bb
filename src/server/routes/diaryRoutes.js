
import express from 'express';
import entryRoutes from './diary/entryRoutes.js';
import categoryRoutes from './diary/categoryRoutes.js';
import tagRoutes from './diary/tagRoutes.js';
import moodRoutes from './diary/moodRoutes.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Diary
 *   description: API для раздела дневника
 */

// Подключение маршрутов для записей дневника
router.use('/diary', entryRoutes);

// Подключение маршрутов для категорий дневника
router.use('/diary', categoryRoutes);

// Подключение маршрутов для тегов дневника
router.use('/diary', tagRoutes);

// Подключение маршрутов для настроений дневника
router.use('/diary', moodRoutes);

export default router;
