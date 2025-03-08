
import express from 'express';
import articleRoutes from './cozy/articleRoutes.js';
import categoryRoutes from './cozy/categoryRoutes.js';
import tagRoutes from './cozy/tagRoutes.js';

const router = express.Router();

// Register all cozy route modules
router.use('/', articleRoutes);
router.use('/', categoryRoutes);
router.use('/', tagRoutes);

export default router;
