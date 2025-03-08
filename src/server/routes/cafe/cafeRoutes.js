
import express from 'express';
import { 
  getCafes, 
  getCafeById, 
  createCafe, 
  updateCafe, 
  deleteCafe,
  getEnrichedCafes
} from '../../controllers/cafeController.js';

const router = express.Router();

/**
 * @swagger
 * /cafes:
 *   get:
 *     summary: Get all cafes
 *     tags: [Cafes]
 *     responses:
 *       200:
 *         description: A list of cafes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cafe'
 */
router.get('/cafes', getCafes);

/**
 * @swagger
 * /cafes/{id}:
 *   get:
 *     summary: Get a cafe by ID
 *     tags: [Cafes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Cafe ID
 *     responses:
 *       200:
 *         description: Cafe details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cafe'
 *       404:
 *         description: Cafe not found
 */
router.get('/cafes/:id', getCafeById);

/**
 * @swagger
 * /cafes:
 *   post:
 *     summary: Create a new cafe
 *     tags: [Cafes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CafeInput'
 *     responses:
 *       201:
 *         description: Cafe created successfully
 *       400:
 *         description: Invalid input data
 */
router.post('/cafes', createCafe);

/**
 * @swagger
 * /cafes/{id}:
 *   put:
 *     summary: Update a cafe
 *     tags: [Cafes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Cafe ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CafeInput'
 *     responses:
 *       200:
 *         description: Cafe updated successfully
 *       404:
 *         description: Cafe not found
 */
router.put('/cafes/:id', updateCafe);

/**
 * @swagger
 * /cafes/{id}:
 *   delete:
 *     summary: Delete a cafe
 *     tags: [Cafes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Cafe ID
 *     responses:
 *       200:
 *         description: Cafe deleted successfully
 *       404:
 *         description: Cafe not found
 */
router.delete('/cafes/:id', deleteCafe);

/**
 * @swagger
 * /cafes/enriched:
 *   get:
 *     summary: Get all cafes with enriched category and tag information
 *     tags: [Cafes]
 *     responses:
 *       200:
 *         description: A list of cafes with category and tag names
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EnrichedCafe'
 */
router.get('/cafes/enriched', getEnrichedCafes);

export default router;
