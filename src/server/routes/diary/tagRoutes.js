import express from 'express';
import {
  getDiaryTags,
  getDiaryTagById,
  getDiaryTagsByIds
} from '../../controllers/diaryController.js';

const router = express.Router();

/**
 * @swagger
 * /diary/tags:
 *   get:
 *     summary: Get all diary tags
 *     tags: [Diary]
 *     responses:
 *       200:
 *         description: A list of diary tags
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
router.get('/diary/tags', getDiaryTags);

/**
 * @swagger
 * /diary/tags/multiple:
 *   get:
 *     summary: Get diary tags by IDs
 *     tags: [Diary]
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
router.get('/diary/tags/multiple', getDiaryTagsByIds);

/**
 * @swagger
 * /diary/tags/{id}:
 *   get:
 *     summary: Get a diary tag by ID
 *     tags: [Diary]
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
router.get('/diary/tags/:id', getDiaryTagById);

export default router;
