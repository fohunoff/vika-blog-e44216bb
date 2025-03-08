
import express from 'express';

// Import modular route handlers
import entryRoutes from './diary/entryRoutes.js';
import categoryRoutes from './diary/categoryRoutes.js';
import tagRoutes from './diary/tagRoutes.js';
import moodRoutes from './diary/moodRoutes.js';

const router = express.Router();

// Mount the modular routes
router.use('/', entryRoutes);
router.use('/', categoryRoutes);
router.use('/', tagRoutes);
router.use('/', moodRoutes);

/**
 * @swagger
 * components:
 *   schemas:
 *     DiaryEntry:
 *       type: object
 *       required:
 *         - id
 *         - title
 *         - content
 *         - date
 *       properties:
 *         id:
 *           type: string
 *           description: The diary entry ID
 *         title:
 *           type: string
 *           description: The diary entry title
 *         content:
 *           type: string
 *           description: The diary entry content
 *         date:
 *           type: string
 *           format: date
 *           description: The date of the diary entry
 *         imageSrc:
 *           type: string
 *           description: URL of the image for the diary entry
 *         categoryId:
 *           type: string
 *           description: ID of the category
 *         moodId:
 *           type: string
 *           description: ID of the mood
 *         shortDescription:
 *           type: string
 *           description: Short description of the entry
 */

export default router;
