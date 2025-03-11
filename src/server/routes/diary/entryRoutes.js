
import express from 'express';
import {
  getDiaryEntries,
  getDiaryEntryById,
  getEnrichedDiaryEntries,
  createDiaryEntry,
  updateDiaryEntry,
  deleteDiaryEntry
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

// GET all diary entries
router.get('/diary/entries', getDiaryEntries);

// GET enriched diary entries
router.get('/diary/entries/enriched', getEnrichedDiaryEntries);

// GET a specific diary entry by ID
router.get('/diary/entries/:id', getDiaryEntryById);

// POST a new diary entry
router.post('/diary/entries', createDiaryEntry);

// PUT (update) a diary entry
router.put('/diary/entries/:id', updateDiaryEntry);

// DELETE a diary entry
router.delete('/diary/entries/:id', deleteDiaryEntry);

export default router;
