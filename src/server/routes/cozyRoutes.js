
import express from 'express';
import { 
  getCozyArticles, getCozyArticleById, getCozyHighlights, 
  getCozyCategories, getCozyCategoryById, 
  getCozyTags, getCozyTagById, getCozyTagsByIds 
} from '../controllers/cozyController.js';

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
