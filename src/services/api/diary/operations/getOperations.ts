
import diaryEntries from '../../../../data/diary.json';
import diaryCategories from '../../../../data/diary/diary-categories.json';
import diaryTags from '../../../../data/diary/diary-tags.json';
import diaryMoods from '../../../../data/diary/diary-moods.json';
import { getData, getById } from '../../utils';
import { DiaryEntry, DiaryCategory, DiaryTag, DiaryMood } from '../../../../types/diary';
import { API_BASE_URL, apiFallback } from '../diaryApiBase';
import { processEntriesResponse, processEntryResponse } from '../utils/arrayUtils';

/**
 * API operations for retrieving diary entries
 */
export const getDiaryOperations = () => ({
  /**
   * Get all diary entries
   */
  getDiaryEntries: async (): Promise<DiaryEntry[]> => {
    return apiFallback(
      async () => {
        const response = await fetch(`${API_BASE_URL}/diary/entries`);
        if (!response.ok) throw new Error('Network response was not ok');
        const entries = await response.json();
        return processEntriesResponse(entries);
      },
      () => getData(diaryEntries as DiaryEntry[])
    );
  },

  /**
   * Get a single diary entry by ID
   */
  getDiaryEntryById: async (id: string): Promise<DiaryEntry | undefined> => {
    return apiFallback(
      async () => {
        const response = await fetch(`${API_BASE_URL}/diary/entries/${id}`);
        if (response.status === 404) return undefined;
        if (!response.ok) throw new Error('Network response was not ok');
        const entry = await response.json();
        if (!entry) return undefined;
        return processEntryResponse(entry);
      },
      () => getById(diaryEntries as DiaryEntry[], id)
    );
  },

  /**
   * Get enriched diary entries with category and tags information
   */
  getEnrichedDiaryEntries: async () => {
    return apiFallback(
      async () => {
        const response = await fetch(`${API_BASE_URL}/diary/entries/enriched`);
        if (!response.ok) throw new Error('Network response was not ok');
        const entries = await response.json();
        return processEntriesResponse(entries);
      },
      async () => {
        const entries = await getData(diaryEntries as DiaryEntry[]);
        const categories = await getData(diaryCategories as DiaryCategory[]);
        const tags = await getData(diaryTags as DiaryTag[]);
        const moods = await getData(diaryMoods as DiaryMood[]);

        return entries.map(entry => {
          const category = categories.find(c => c.id === entry.categoryId);
          const entryTags = entry.tagIds.map(id => tags.find(t => t.id === id)).filter(Boolean);
          const mood = moods.find(m => m.id === entry.moodId);

          return {
            ...entry,
            category: category?.name,
            tags: entryTags.map(t => t?.name),
            mood: mood?.name
          };
        });
      }
    );
  }
});
