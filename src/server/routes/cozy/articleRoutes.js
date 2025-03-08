
import express from 'express';
import { 
  getCozyArticles, 
  getCozyArticleById, 
  getCozyHighlights 
} from '../../controllers/cozyController.js';

const router = express.Router();

/**
 * @swagger
 * /cozy/articles:
 *   get:
 *     summary: Get all cozy articles
 *     tags: [Cozy Articles]
 *     responses:
 *       200:
 *         description: A list of cozy articles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CozyArticle'
 */
router.get('/cozy/articles', getCozyArticles);

/**
 * @swagger
 * /cozy/articles/{id}:
 *   get:
 *     summary: Get a cozy article by ID
 *     tags: [Cozy Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Article ID
 *     responses:
 *       200:
 *         description: Article details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CozyArticle'
 *       404:
 *         description: Article not found
 */
router.get('/cozy/articles/:id', getCozyArticleById);

/**
 * @swagger
 * /cozy/highlights:
 *   get:
 *     summary: Get highlighted cozy articles
 *     tags: [Cozy Articles]
 *     responses:
 *       200:
 *         description: A list of highlighted cozy articles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CozyArticle'
 */
router.get('/cozy/highlights', getCozyHighlights);

export default router;
