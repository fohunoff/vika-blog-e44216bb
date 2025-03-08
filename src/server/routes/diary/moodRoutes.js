
import express from 'express';
import { 
  getDiaryMoods, 
  getDiaryMoodById 
} from '../../controllers/diaryController.js';

const router = express.Router();

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
