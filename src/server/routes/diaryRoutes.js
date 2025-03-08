
import express from 'express';
import { 
  getDiaryEntries, getDiaryEntryById, 
  getDiaryCategories, getDiaryCategoryById,
  getDiaryTags, getDiaryTagById, getDiaryTagsByIds,
  getDiaryMoods, getDiaryMoodById, getEnrichedDiaryEntries
} from '../controllers/diaryController.js';

const router = express.Router();

/**
 * @swagger
 * /diary/entries:
 *   get:
 *     summary: Get all diary entries
 *     tags: [Diary]
 *     responses:
 *       200:
 *         description: A list of diary entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DiaryEntry'
 */
router.get('/diary/entries', getDiaryEntries);

/**
 * @swagger
 * /diary/entries/{id}:
 *   get:
 *     summary: Get a diary entry by ID
 *     tags: [Diary]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Diary entry ID
 *     responses:
 *       200:
 *         description: Diary entry details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DiaryEntry'
 *       404:
 *         description: Diary entry not found
 */
router.get('/diary/entries/:id', getDiaryEntryById);

/**
 * @swagger
 * /diary/entries/enriched:
 *   get:
 *     summary: Get enriched diary entries with category and tags information
 *     tags: [Diary]
 *     responses:
 *       200:
 *         description: A list of enriched diary entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/components/schemas/DiaryEntry'
 *                   - type: object
 *                     properties:
 *                       category:
 *                         type: string
 *                       tags:
 *                         type: array
 *                         items:
 *                           type: string
 *                       mood:
 *                         type: string
 */
router.get('/diary/entries/enriched', getEnrichedDiaryEntries);

/**
 * @swagger
 * /diary/categories:
 *   get:
 *     summary: Get all diary categories
 *     tags: [Diary]
 *     responses:
 *       200:
 *         description: A list of diary categories
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
router.get('/diary/categories', getDiaryCategories);

/**
 * @swagger
 * /diary/categories/{id}:
 *   get:
 *     summary: Get a diary category by ID
 *     tags: [Diary]
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
router.get('/diary/categories/:id', getDiaryCategoryById);

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
 * /diary/moods:
 *   get:
 *     summary: Get all diary moods
 *     tags: [Diary]
 *     responses:
 *       200:
 *         description: A list of diary moods
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
 *                   icon:
 *                     type: string
 */
router.get('/diary/moods', getDiaryMoods);

/**
 * @swagger
 * /diary/moods/{id}:
 *   get:
 *     summary: Get a diary mood by ID
 *     tags: [Diary]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Mood ID
 *     responses:
 *       200:
 *         description: Mood details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 icon:
 *                   type: string
 *       404:
 *         description: Mood not found
 */
router.get('/diary/moods/:id', getDiaryMoodById);

export default router;
