
import express from 'express';
import categoryRoutes from './diary/categoryRoutes.js';
import tagRoutes from './diary/tagRoutes.js';
import moodRoutes from './diary/moodRoutes.js';
import entryRoutes from './diary/entryRoutes.js';

const router = express.Router();

// Mount all the diary-related routes
router.use('/', entryRoutes);
router.use('/', categoryRoutes);
router.use('/', tagRoutes);
router.use('/', moodRoutes);

export default router;
