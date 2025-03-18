
import express from 'express';
import { body } from 'express-validator';
import { validateRequest, validateIdParam } from '../../middleware/validationMiddleware.js';
import { 
  getDiaryCategories,
  getDiaryCategoryById,
  createDiaryCategory,
  updateDiaryCategory,
  deleteDiaryCategory
} from '../../controllers/diaryController.js';
import { handleAsync } from '../../middleware/errorMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /diary/categories:
 *   get:
 *     summary: Get all diary categories
 *     tags: [Diary Categories]
 *     responses:
 *       200:
 *         description: List of diary categories
 */
router.get('/diary/categories', handleAsync(getDiaryCategories));

/**
 * @swagger
 * /diary/categories/{id}:
 *   get:
 *     summary: Get a diary category by ID
 *     tags: [Diary Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the diary category
 *     responses:
 *       200:
 *         description: Diary category details
 *       404:
 *         description: Category not found
 */
router.get('/diary/categories/:id', validateIdParam, handleAsync(getDiaryCategoryById));

/**
 * @swagger
 * /diary/categories:
 *   post:
 *     summary: Create a new diary category
 *     tags: [Diary Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created diary category
 */
router.post(
  '/diary/categories',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    validateRequest
  ],
  handleAsync(createDiaryCategory)
);

/**
 * @swagger
 * /diary/categories/{id}:
 *   put:
 *     summary: Update a diary category
 *     tags: [Diary Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the diary category to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated diary category
 *       404:
 *         description: Category not found
 */
router.put(
  '/diary/categories/:id',
  [
    validateIdParam,
    body('name').trim().notEmpty().withMessage('Name is required'),
    validateRequest
  ],
  handleAsync(updateDiaryCategory)
);

/**
 * @swagger
 * /diary/categories/{id}:
 *   delete:
 *     summary: Delete a diary category
 *     tags: [Diary Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the diary category to delete
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 */
router.delete('/diary/categories/:id', validateIdParam, handleAsync(deleteDiaryCategory));

export default router;
