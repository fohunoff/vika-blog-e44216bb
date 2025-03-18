
import express from 'express';
import { body } from 'express-validator';
import { validateRequest, validateIdParam } from '../../middleware/validationMiddleware.js';
import { 
  getDiaryMoods,
  getDiaryMoodById,
  createDiaryMood,
  updateDiaryMood,
  deleteDiaryMood 
} from '../../controllers/diaryController.js';
import { handleAsync } from '../../middleware/errorMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /diary/moods:
 *   get:
 *     summary: Get all diary moods
 *     tags: [Diary Moods]
 *     responses:
 *       200:
 *         description: List of diary moods
 */
router.get('/diary/moods', handleAsync(getDiaryMoods));

/**
 * @swagger
 * /diary/moods/{id}:
 *   get:
 *     summary: Get a diary mood by ID
 *     tags: [Diary Moods]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the diary mood
 *     responses:
 *       200:
 *         description: Diary mood details
 *       404:
 *         description: Mood not found
 */
router.get('/diary/moods/:id', validateIdParam, handleAsync(getDiaryMoodById));

/**
 * @swagger
 * /diary/moods:
 *   post:
 *     summary: Create a new diary mood
 *     tags: [Diary Moods]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               icon:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created diary mood
 */
router.post(
  '/diary/moods',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    validateRequest
  ],
  handleAsync(createDiaryMood)
);

/**
 * @swagger
 * /diary/moods/{id}:
 *   put:
 *     summary: Update a diary mood
 *     tags: [Diary Moods]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the diary mood to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               icon:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated diary mood
 *       404:
 *         description: Mood not found
 */
router.put(
  '/diary/moods/:id',
  [
    validateIdParam,
    body('name').trim().notEmpty().withMessage('Name is required'),
    validateRequest
  ],
  handleAsync(updateDiaryMood)
);

/**
 * @swagger
 * /diary/moods/{id}:
 *   delete:
 *     summary: Delete a diary mood
 *     tags: [Diary Moods]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the diary mood to delete
 *     responses:
 *       200:
 *         description: Mood deleted successfully
 *       404:
 *         description: Mood not found
 */
router.delete('/diary/moods/:id', validateIdParam, handleAsync(deleteDiaryMood));

export default router;
