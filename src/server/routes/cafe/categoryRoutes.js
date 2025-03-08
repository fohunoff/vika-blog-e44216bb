import express from 'express';
import {
  getCafeCategories,
  getCafeCategoryById
} from '../../controllers/cafeController.js';

const router = express.Router();

/**
 * @swagger
 * /cafes/categories:
 *   get:
 *     summary: Get all cafe categories
 *     tags: [Cafes]
 *     responses:
 *       200:
 *         description: A list of cafe categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CafeCategory'
 */
router.get('/', getCafeCategories);  // Изменено с '/cafes/categories' на '/'

/**
 * @swagger
 * /cafes/categories/{id}:
 *   get:
 *     summary: Get a cafe category by ID
 *     tags: [Cafes]
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
 *               $ref: '#/components/schemas/CafeCategory'
 *       404:
 *         description: Category not found
 */
router.get('/:id', getCafeCategoryById);  // Изменено с '/cafes/categories/:id' на '/:id'

export default router;
