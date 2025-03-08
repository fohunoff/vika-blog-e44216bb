
import express from 'express';
import { 
  getCozyCategories, 
  getCozyCategoryById 
} from '../../controllers/cozyController.js';

const router = express.Router();

/**
 * @swagger
 * /cozy/categories:
 *   get:
 *     summary: Get all cozy categories
 *     tags: [Cozy Articles]
 *     responses:
 *       200:
 *         description: A list of cozy categories
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
router.get('/cozy/categories', getCozyCategories);

/**
 * @swagger
 * /cozy/categories/{id}:
 *   get:
 *     summary: Get a cozy category by ID
 *     tags: [Cozy Articles]
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
router.get('/cozy/categories/:id', getCozyCategoryById);

export default router;
