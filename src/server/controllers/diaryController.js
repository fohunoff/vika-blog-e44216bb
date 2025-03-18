
// Re-export all diary controllers from their respective files
import { validateIds, filterValidIds } from './diary/diaryUtils.js';

// Entry controllers
import {
  getDiaryEntries,
  getDiaryEntryById,
  getEnrichedDiaryEntries,
  createDiaryEntry,
  updateDiaryEntry,
  deleteDiaryEntry
} from './diary/entryController.js';

// Category controllers
import {
  getDiaryCategories,
  getDiaryCategoryById,
  createDiaryCategory,
  updateDiaryCategory,
  deleteDiaryCategory
} from './diary/categoryController.js';

// Tag controllers
import {
  getDiaryTags,
  getDiaryTagById,
  getDiaryTagsByIds,
  createDiaryTag,
  updateDiaryTag,
  deleteDiaryTag
} from './diary/tagController.js';

// Mood controllers
import {
  getDiaryMoods,
  getDiaryMoodById,
  createDiaryMood,
  updateDiaryMood,
  deleteDiaryMood
} from './diary/moodController.js';

// Export all controllers
export {
  // Utility functions
  validateIds,
  filterValidIds,
  
  // Entry controllers
  getDiaryEntries,
  getDiaryEntryById,
  getEnrichedDiaryEntries,
  createDiaryEntry,
  updateDiaryEntry,
  deleteDiaryEntry,
  
  // Category controllers
  getDiaryCategories,
  getDiaryCategoryById,
  createDiaryCategory,
  updateDiaryCategory,
  deleteDiaryCategory,
  
  // Tag controllers
  getDiaryTags,
  getDiaryTagById,
  getDiaryTagsByIds,
  createDiaryTag,
  updateDiaryTag,
  deleteDiaryTag,
  
  // Mood controllers
  getDiaryMoods,
  getDiaryMoodById,
  createDiaryMood,
  updateDiaryMood,
  deleteDiaryMood
};
