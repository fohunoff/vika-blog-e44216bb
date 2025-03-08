
import express from 'express';
import { 
  getCozyTags, 
  getCozyTagById, 
  getCozyTagsByIds 
} from '../../controllers/cozyController.js';

const router = express.Router();

/**
 * @swagger
 * /cozy/tags:
 *   get:
 *     summary: Get all cozy tags
 *     tags: [Cozy Articles]
 *     responses:
 *       200:
 *         description: A list of cozy tags
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
router.get('/cozy/tags', getCozyTags);

/**
 * @swagger
 * /cozy/tags/{id}:
 *   get:
 *     summary: Get a cozy tag by ID
 *     tags: [Cozy Articles]
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
 *               type: object
 *               properties:
 *                 id: 
 *                   type: string
 *                 name: 
 *                   type: string
 *       404:
 *         description: Tag not found
 */
router.get('/cozy/tags/:id', getCozyTagById);

/**
 * @swagger
 * /cozy/tags/multiple:
 *   get:
 *     summary: Get cozy tags by IDs
 *     tags: [Cozy Articles]
 *     parameters:
 *       - in: query
 *         name: ids
 *         schema:
 *           type: string
 *         required: true
 *         description: Comma-separated tag IDs
 *     responses:
 *       200:
 *         description: List of tags
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
router.get('/cozy/tags/multiple', getCozyTagsByIds);

export default router;
