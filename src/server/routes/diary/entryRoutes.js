import express from 'express';
import {
  getDiaryEntries,
  getDiaryEntryById,
  getEnrichedDiaryEntries
} from '../../controllers/diaryController.js';

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

export default router;
