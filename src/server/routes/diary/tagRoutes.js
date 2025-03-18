
import express from 'express';
import { body } from 'express-validator';
import { validateRequest, validateIdParam, validateIdsQuery } from '../../middleware/validationMiddleware.js';
import { 
  getDiaryTags, 
  getDiaryTagById,
  getDiaryTagsByIds,
  createDiaryTag,
  updateDiaryTag,
  deleteDiaryTag 
} from '../../controllers/diaryController.js';
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
router.get('/diary/tags', handleAsync(getDiaryTags));

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
router.get('/diary/tags/:id', validateIdParam, handleAsync(getDiaryTagById));

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
router.get('/diary/tags/multiple', validateIdsQuery, handleAsync(getDiaryTagsByIds));

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
  '/diary/tags',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    validateRequest
  ],
  handleAsync(createDiaryTag)
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
  '/diary/tags/:id',
  [
    validateIdParam,
    body('name').trim().notEmpty().withMessage('Name is required'),
    validateRequest
  ],
  handleAsync(updateDiaryTag)
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
router.delete('/diary/tags/:id', validateIdParam, handleAsync(deleteDiaryTag));

export default router;
