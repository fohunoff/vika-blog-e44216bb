
import express from 'express';
import { param, body } from 'express-validator';
import { db } from '../../db/config.js';
import { validateRequest } from '../../middleware/validationMiddleware.js';

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
 */
router.get('/entries', (req, res) => {
  try {
    db.all('SELECT * FROM diary_entries', [], (err, rows) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json(rows || []);
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: error.message });
  }
});

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
 *         description: A diary entry
 *       404:
 *         description: Diary entry not found
 */
router.get('/entries/:id', param('id').notEmpty(), validateRequest, (req, res) => {
  try {
    const { id } = req.params;
    console.log('Getting diary entry with ID:', id);
    
    db.get('SELECT * FROM diary_entries WHERE id = ?', [id], (err, row) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: err.message });
      }
      
      if (!row) {
        console.log('Diary entry not found:', id);
        return res.status(404).json({ error: 'Diary entry not found' });
      }
      
      res.json(row);
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: error.message });
  }
});

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
 *     responses:
 *       201:
 *         description: Created diary entry
 */
router.post('/entries', [
  body('title').notEmpty(),
  body('content').notEmpty(),
  body('date').notEmpty(),
  validateRequest
], (req, res) => {
  try {
    const entry = req.body;
    console.log('Creating diary entry:', entry);
    
    // Generate a new ID for the entry
    const id = `diary-entry-${Date.now()}`;
    const newEntry = { id, ...entry };
    
    // In a real app, you would save this to your database
    // For now, we'll just simulate success
    res.status(201).json(newEntry);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: error.message });
  }
});

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
 *     responses:
 *       200:
 *         description: Updated diary entry
 *       404:
 *         description: Diary entry not found
 */
router.put('/entries/:id', [
  param('id').notEmpty(),
  body('title').notEmpty(),
  body('content').notEmpty(),
  validateRequest
], (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    console.log('Updating diary entry:', id, updates);
    
    // In a real app, you would update this in your database
    // For now, we'll just simulate success
    res.json({ id, ...updates });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: error.message });
  }
});

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
router.delete('/entries/:id', param('id').notEmpty(), validateRequest, (req, res) => {
  try {
    const { id } = req.params;
    console.log('Deleting diary entry:', id);
    
    // In a real app, you would delete this from your database
    // For now, we'll just simulate success
    res.status(204).send();
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
