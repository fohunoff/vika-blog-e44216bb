import express from 'express';
import {
  getCafeTags,
  getCafeTagById,
  getCafeTagsByIds
} from '../../controllers/cafeController.js';

const router = express.Router();

/**
 * @swagger
 * /cafes/tags:
 *   get:
 *     summary: Get all cafe tags
 *     tags: [Cafes]
 *     responses:
 *       200:
 *         description: A list of cafe tags
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CafeTag'
 */
router.get('/', getCafeTags);  // Изменено с '/cafes/tags' на '/'

/**
 * @swagger
 * /cafes/tags/{id}:
 *   get:
 *     summary: Get a cafe tag by ID
 *     tags: [Cafes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Tag ID
 *     responses:
 *       200:
 *         description: Tag details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CafeTag'
 *       404:
 *         description: Tag not found
 */
router.get('/:id', getCafeTagById);  // Изменено с '/cafes/tags/:id' на '/:id'

/**
 * @swagger
 * /cafes/tags/byIds:
 *   post:
 *     summary: Get cafe tags by IDs
 *     tags: [Cafes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: A list of cafe tags
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CafeTag'
 *       400:
 *         description: Invalid input data
 */
router.post('/byIds', getCafeTagsByIds);  // Изменено с '/cafes/tags/byIds' на '/byIds'

export default router;
