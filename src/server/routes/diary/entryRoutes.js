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
 *         description: List of diary entries
 *   post:
 *     summary: Create a new diary entry
 *     tags: [Diary]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - date
 *               - categoryIds
 *               - tagIds
 *               - moodIds
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               shortDescription:
 *                 type: string
 *               imageSrc:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               categoryIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               tagIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               moodIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Created diary entry
 *       400:
 *         description: Invalid input
 * 
 * /diary/entries/{id}:
 *   get:
 *     summary: Get a diary entry by ID
 *     tags: [Diary]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Diary entry found
 *       404:
 *         description: Diary entry not found
 *   put:
 *     summary: Update a diary entry
 *     tags: [Diary]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DiaryEntry'
 *     responses:
 *       200:
 *         description: Updated diary entry
 *       404:
 *         description: Diary entry not found
 *   delete:
 *     summary: Delete a diary entry
 *     tags: [Diary]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Diary entry deleted
 *       404:
 *         description: Diary entry not found
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
 * */
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
