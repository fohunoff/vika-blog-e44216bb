
import { createDiaryEntriesApi } from './diary/diaryEntriesApi';
import { createDiaryCategoriesApi } from './diary/diaryCategoriesApi';
import { createDiaryTagsApi } from './diary/diaryTagsApi';
import { createDiaryMoodsApi } from './diary/diaryMoodsApi';

export function createDiaryApi() {
  const entriesApi = createDiaryEntriesApi();
  const categoriesApi = createDiaryCategoriesApi();
  const tagsApi = createDiaryTagsApi();
  const moodsApi = createDiaryMoodsApi();

  return {
    // Entries API
    getDiaryEntries: entriesApi.getDiaryEntries,
    getDiaryEntryById: entriesApi.getDiaryEntryById,
    getEnrichedDiaryEntries: entriesApi.getEnrichedDiaryEntries,
    createDiaryEntry: entriesApi.createDiaryEntry,
    updateDiaryEntry: entriesApi.updateDiaryEntry,
    deleteDiaryEntry: entriesApi.deleteDiaryEntry,

    // Categories API
    getCategories: categoriesApi.getCategories,
    getCategoryById: categoriesApi.getCategoryById,

    // Tags API
    getTags: tagsApi.getTags,
    getTagById: tagsApi.getTagById,
    getTagsByIds: tagsApi.getTagsByIds,

    // Moods API
    getMoods: moodsApi.getMoods,
    getMoodById: moodsApi.getMoodById
  };
}
