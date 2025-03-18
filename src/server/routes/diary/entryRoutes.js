
import express from 'express';
import { body } from 'express-validator';
import { validateRequest, validateIdParam } from '../../middleware/validationMiddleware.js';
import {
  getDiaryEntries,
  getDiaryEntryById,
  getEnrichedDiaryEntries,
  createDiaryEntry,
  updateDiaryEntry,
  deleteDiaryEntry
} from '../../controllers/diaryController.js';
import { handleAsync } from '../../middleware/errorMiddleware.js';

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
 */
router.get('/diary/entries', handleAsync(getDiaryEntries));

/**
 * @swagger
 * /diary/entries/enriched:
 *   get:
 *     summary: Get enriched diary entries with categories, tags and moods
 *     tags: [Diary]
 *     responses:
 *       200:
 *         description: List of enriched diary entries
 */
router.get('/diary/entries/enriched', handleAsync(getEnrichedDiaryEntries));

/**
 * @swagger
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
 */
router.get('/diary/entries/:id', validateIdParam, handleAsync(getDiaryEntryById));

/**
 * @swagger
 * /diary/entries:
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
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               shortDescription:
 *                 type: string
 *               imageSrc:
 *                 type: string
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
 */
router.post(
  '/diary/entries',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required'),
    validateRequest
  ],
  handleAsync(createDiaryEntry)
);

/**
 * @swagger
 * /diary/entries/{id}:
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
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               shortDescription:
 *                 type: string
 *               imageSrc:
 *                 type: string
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
 *       200:
 *         description: Updated diary entry
 *       404:
 *         description: Diary entry not found
 */
router.put(
  '/diary/entries/:id',
  [
    validateIdParam,
    body('title').notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required'),
    validateRequest
  ],
  handleAsync(updateDiaryEntry)
);

/**
 * @swagger
 * /diary/entries/{id}:
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
router.delete('/diary/entries/:id', validateIdParam, handleAsync(deleteDiaryEntry));

export default router;
