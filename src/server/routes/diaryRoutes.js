
import express from 'express';
import categoryRoutes from './diary/categoryRoutes.js';
import tagRoutes from './diary/tagRoutes.js';
import moodRoutes from './diary/moodRoutes.js';
import entryRoutes from './diary/entryRoutes.js';

const router = express.Router();

// Register sub-routes
router.use('/diary', categoryRoutes);
router.use('/diary', tagRoutes);
router.use('/diary', moodRoutes);
router.use('/diary', entryRoutes);

export default router;
