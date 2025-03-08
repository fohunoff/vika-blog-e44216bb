
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
router.get('/cafes/price-ranges', getCafePriceRanges);

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
router.get('/cafes/price-ranges/:id', getCafePriceRangeById);

export default router;
