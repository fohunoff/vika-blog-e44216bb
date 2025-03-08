
import express from 'express';
import { 
  getDiaryCategories, 
  getDiaryCategoryById 
} from '../../controllers/diaryController.js';

const router = express.Router();

/**
 * @swagger
 * /diary/categories:
 *   get:
 *     summary: Get all diary categories
 *     tags: [Diary]
 *     responses:
 *       200:
 *         description: A list of diary categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 */
router.get('/diary/categories', getDiaryCategories);

/**
 * @swagger
 * /diary/categories/{id}:
 *   get:
 *     summary: Get a diary category by ID
 *     tags: [Diary]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *       404:
 *         description: Category not found
 */
router.get('/diary/categories/:id', getDiaryCategoryById);

export default router;
