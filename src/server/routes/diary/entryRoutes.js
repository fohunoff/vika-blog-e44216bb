
import express from 'express';
import { 
  getAllDiaryEntries, 
  getDiaryEntryById, 
  createDiaryEntry, 
  updateDiaryEntry, 
  deleteDiaryEntry,
  getEnrichedDiaryEntries
} from '../../controllers/diaryController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Diary Entries
 *   description: API для управления записями дневника
 */

/**
 * @swagger
 * /diary/entries:
 *   get:
 *     summary: Получить все записи дневника
 *     tags: [Diary Entries]
 *     responses:
 *       200:
 *         description: Список всех записей дневника
 */
router.get('/entries', getAllDiaryEntries);

/**
 * @swagger
 * /diary/entries/enriched:
 *   get:
 *     summary: Получить все записи дневника с дополнительной информацией
 *     tags: [Diary Entries]
 *     responses:
 *       200:
 *         description: Список всех записей дневника с информацией о категориях и тегах
 */
router.get('/entries/enriched', getEnrichedDiaryEntries);

/**
 * @swagger
 * /diary/entries/{id}:
 *   get:
 *     summary: Получить запись дневника по ID
 *     tags: [Diary Entries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID записи дневника
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Запись дневника
 *       404:
 *         description: Запись не найдена
 */
router.get('/entries/:id', getDiaryEntryById);

/**
 * @swagger
 * /diary/entry:
 *   post:
 *     summary: Создать новую запись дневника
 *     tags: [Diary Entries]
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
 *         description: Новая запись создана
 *       400:
 *         description: Ошибка валидации данных
 */
router.post('/entry', createDiaryEntry);

/**
 * @swagger
 * /diary/entry/{id}:
 *   put:
 *     summary: Обновить запись дневника
 *     tags: [Diary Entries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID записи дневника
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
 *       200:
 *         description: Запись обновлена
 *       404:
 *         description: Запись не найдена
 *       400:
 *         description: Ошибка валидации данных
 */
router.put('/entry/:id', updateDiaryEntry);

/**
 * @swagger
 * /diary/entry/{id}:
 *   delete:
 *     summary: Удалить запись дневника
 *     tags: [Diary Entries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID записи дневника
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Запись удалена
 *       404:
 *         description: Запись не найдена
 */
router.delete('/entry/:id', deleteDiaryEntry);

export default router;
