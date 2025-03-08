
import express from 'express';
import * as diaryController from '../controllers/diaryController.js';

const router = express.Router();

// Diary entries routes
router.get('/diary/entries', diaryController.getAllEntries);
router.get('/diary/entries/:id', diaryController.getEntryById);

// Diary categories route
router.get('/diary/categories', diaryController.getCategories);

// Diary moods route
router.get('/diary/moods', diaryController.getMoods);

// Diary tags routes
router.get('/diary/tags', diaryController.getTags);
router.get('/diary/tags/multiple', diaryController.getTagsByIds);

export default router;
