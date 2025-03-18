
import express from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../../middleware/validationMiddleware.js';
import { db } from '../../db/config.js';
import { handleAsync } from '../../middleware/errorMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /diary/categories:
 *   get:
 *     summary: Get all diary categories
 *     tags: [Diary Categories]
 *     responses:
 *       200:
 *         description: List of diary categories
 */
router.get('/', handleAsync(async (req, res) => {
  const categories = await db.all('SELECT * FROM diary_categories ORDER BY name');
  res.json(categories);
}));

/**
 * @swagger
 * /diary/categories/{id}:
 *   get:
 *     summary: Get a diary category by ID
 *     tags: [Diary Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the diary category
 *     responses:
 *       200:
 *         description: Diary category details
 *       404:
 *         description: Category not found
 */
router.get('/:id', handleAsync(async (req, res) => {
  const category = await db.get('SELECT * FROM diary_categories WHERE id = ?', req.params.id);
  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }
  res.json(category);
}));

/**
 * @swagger
 * /diary/categories:
 *   post:
 *     summary: Create a new diary category
 *     tags: [Diary Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created diary category
 */
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    validateRequest
  ],
  handleAsync(async (req, res) => {
    const { name, image } = req.body;
    const id = `category-diary-${Date.now()}`;
    
    await db.run(
      'INSERT INTO diary_categories (id, name, image) VALUES (?, ?, ?)',
      [id, name, image || null]
    );
    
    const newCategory = await db.get('SELECT * FROM diary_categories WHERE id = ?', id);
    res.status(201).json(newCategory);
  })
);

/**
 * @swagger
 * /diary/categories/{id}:
 *   put:
 *     summary: Update a diary category
 *     tags: [Diary Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the diary category to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated diary category
 *       404:
 *         description: Category not found
 */
router.put(
  '/:id',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    validateRequest
  ],
  handleAsync(async (req, res) => {
    const { name, image } = req.body;
    const { id } = req.params;
    
    // Check if category exists
    const existingCategory = await db.get('SELECT * FROM diary_categories WHERE id = ?', id);
    if (!existingCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    await db.run(
      'UPDATE diary_categories SET name = ?, image = ? WHERE id = ?',
      [name, image || null, id]
    );
    
    const updatedCategory = await db.get('SELECT * FROM diary_categories WHERE id = ?', id);
    res.json(updatedCategory);
  })
);

/**
 * @swagger
 * /diary/categories/{id}:
 *   delete:
 *     summary: Delete a diary category
 *     tags: [Diary Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the diary category to delete
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 */
router.delete('/:id', handleAsync(async (req, res) => {
  const { id } = req.params;
  
  // Check if category exists
  const existingCategory = await db.get('SELECT * FROM diary_categories WHERE id = ?', id);
  if (!existingCategory) {
    return res.status(404).json({ message: 'Category not found' });
  }
  
  await db.run('DELETE FROM diary_categories WHERE id = ?', id);
  res.json({ message: 'Category deleted successfully' });
}));

export default router;
