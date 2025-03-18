
import express from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../../middleware/validationMiddleware.js';
import { db } from '../../db/config.js';
import { handleAsync } from '../../middleware/errorMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /diary/tags:
 *   get:
 *     summary: Get all diary tags
 *     tags: [Diary Tags]
 *     responses:
 *       200:
 *         description: List of diary tags
 */
router.get('/', handleAsync(async (req, res) => {
  const tags = await db.all('SELECT * FROM diary_tags ORDER BY name');
  res.json(tags);
}));

/**
 * @swagger
 * /diary/tags/{id}:
 *   get:
 *     summary: Get a diary tag by ID
 *     tags: [Diary Tags]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the diary tag
 *     responses:
 *       200:
 *         description: Diary tag details
 *       404:
 *         description: Tag not found
 */
router.get('/:id', handleAsync(async (req, res) => {
  const tag = await db.get('SELECT * FROM diary_tags WHERE id = ?', req.params.id);
  if (!tag) {
    return res.status(404).json({ message: 'Tag not found' });
  }
  res.json(tag);
}));

/**
 * @swagger
 * /diary/tags/multiple:
 *   get:
 *     summary: Get multiple diary tags by IDs
 *     tags: [Diary Tags]
 *     parameters:
 *       - in: query
 *         name: ids
 *         schema:
 *           type: string
 *         description: Comma-separated tag IDs
 *     responses:
 *       200:
 *         description: List of requested diary tags
 */
router.get('/multiple', handleAsync(async (req, res) => {
  const { ids } = req.query;
  
  if (!ids) {
    return res.json([]);
  }
  
  const tagIds = ids.split(',');
  const placeholders = tagIds.map(() => '?').join(',');
  
  const tags = await db.all(
    `SELECT * FROM diary_tags WHERE id IN (${placeholders}) ORDER BY name`,
    tagIds
  );
  
  res.json(tags);
}));

/**
 * @swagger
 * /diary/tags:
 *   post:
 *     summary: Create a new diary tag
 *     tags: [Diary Tags]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created diary tag
 */
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    validateRequest
  ],
  handleAsync(async (req, res) => {
    const { name } = req.body;
    const id = `tag-diary-${Date.now()}`;
    
    await db.run(
      'INSERT INTO diary_tags (id, name) VALUES (?, ?)',
      [id, name]
    );
    
    const newTag = await db.get('SELECT * FROM diary_tags WHERE id = ?', id);
    res.status(201).json(newTag);
  })
);

/**
 * @swagger
 * /diary/tags/{id}:
 *   put:
 *     summary: Update a diary tag
 *     tags: [Diary Tags]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the diary tag to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated diary tag
 *       404:
 *         description: Tag not found
 */
router.put(
  '/:id',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    validateRequest
  ],
  handleAsync(async (req, res) => {
    const { name } = req.body;
    const { id } = req.params;
    
    // Check if tag exists
    const existingTag = await db.get('SELECT * FROM diary_tags WHERE id = ?', id);
    if (!existingTag) {
      return res.status(404).json({ message: 'Tag not found' });
    }
    
    await db.run(
      'UPDATE diary_tags SET name = ? WHERE id = ?',
      [name, id]
    );
    
    const updatedTag = await db.get('SELECT * FROM diary_tags WHERE id = ?', id);
    res.json(updatedTag);
  })
);

/**
 * @swagger
 * /diary/tags/{id}:
 *   delete:
 *     summary: Delete a diary tag
 *     tags: [Diary Tags]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the diary tag to delete
 *     responses:
 *       200:
 *         description: Tag deleted successfully
 *       404:
 *         description: Tag not found
 */
router.delete('/:id', handleAsync(async (req, res) => {
  const { id } = req.params;
  
  // Check if tag exists
  const existingTag = await db.get('SELECT * FROM diary_tags WHERE id = ?', id);
  if (!existingTag) {
    return res.status(404).json({ message: 'Tag not found' });
  }
  
  await db.run('DELETE FROM diary_tags WHERE id = ?', id);
  res.json({ message: 'Tag deleted successfully' });
}));

export default router;
