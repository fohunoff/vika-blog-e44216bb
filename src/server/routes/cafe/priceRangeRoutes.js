import express from 'express';
import {
  getCafePriceRanges,
  getCafePriceRangeById
} from '../../controllers/cafeController.js';

const router = express.Router();

/**
 * @swagger
 * /cafes/price-ranges:
 *   get:
 *     summary: Get all cafe price ranges
 *     tags: [Cafes]
 *     responses:
 *       200:
 *         description: A list of cafe price ranges
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CafePriceRange'
 */
router.get('/', getCafePriceRanges);  // Изменено с '/cafes/price-ranges' на '/'

/**
 * @swagger
 * /cafes/price-ranges/{id}:
 *   get:
 *     summary: Get a cafe price range by ID
 *     tags: [Cafes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Price Range ID
 *     responses:
 *       200:
 *         description: Price range details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CafePriceRange'
 *       404:
 *         description: Price range not found
 */
router.get('/:id', getCafePriceRangeById);  // Изменено с '/cafes/price-ranges/:id' на '/:id'

export default router;
