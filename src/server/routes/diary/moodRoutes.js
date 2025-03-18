
import express from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../../middleware/validationMiddleware.js';
import { db } from '../../db/config.js';
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
router.get('/', handleAsync(async (req, res) => {
  const moods = await db.all('SELECT * FROM diary_moods ORDER BY name');
  res.json(moods);
}));

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
router.get('/:id', handleAsync(async (req, res) => {
  const mood = await db.get('SELECT * FROM diary_moods WHERE id = ?', req.params.id);
  if (!mood) {
    return res.status(404).json({ message: 'Mood not found' });
  }
  res.json(mood);
}));

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
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    validateRequest
  ],
  handleAsync(async (req, res) => {
    const { name, icon } = req.body;
    const id = `mood-${Date.now()}`;
    
    await db.run(
      'INSERT INTO diary_moods (id, name, icon) VALUES (?, ?, ?)',
      [id, name, icon || null]
    );
    
    const newMood = await db.get('SELECT * FROM diary_moods WHERE id = ?', id);
    res.status(201).json(newMood);
  })
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
  '/:id',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    validateRequest
  ],
  handleAsync(async (req, res) => {
    const { name, icon } = req.body;
    const { id } = req.params;
    
    // Check if mood exists
    const existingMood = await db.get('SELECT * FROM diary_moods WHERE id = ?', id);
    if (!existingMood) {
      return res.status(404).json({ message: 'Mood not found' });
    }
    
    await db.run(
      'UPDATE diary_moods SET name = ?, icon = ? WHERE id = ?',
      [name, icon || null, id]
    );
    
    const updatedMood = await db.get('SELECT * FROM diary_moods WHERE id = ?', id);
    res.json(updatedMood);
  })
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
router.delete('/:id', handleAsync(async (req, res) => {
  const { id } = req.params;
  
  // Check if mood exists
  const existingMood = await db.get('SELECT * FROM diary_moods WHERE id = ?', id);
  if (!existingMood) {
    return res.status(404).json({ message: 'Mood not found' });
  }
  
  await db.run('DELETE FROM diary_moods WHERE id = ?', id);
  res.json({ message: 'Mood deleted successfully' });
}));

export default router;
