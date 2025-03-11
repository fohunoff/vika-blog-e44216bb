
import diaryEntries from '../../data/diary.json';
import diaryCategories from '../../data/diary/diary-categories.json';
import diaryTags from '../../data/diary/diary-tags.json';
import diaryMoods from '../../data/diary/diary-moods.json';
import { getData, getById, getByIds, retryPromise } from './utils';
import { DiaryCategory, DiaryEntry, DiaryTag, DiaryMood, DiaryEntryFormData } from '../../types/models';

const API_BASE_URL = 'http://localhost:3001';

export function createDiaryApi() {
  return {
    /**
     * Get all diary entries
     */
    getDiaryEntries: async (): Promise<DiaryEntry[]> => {
      // Try to get data from API first
      try {
        const response = await fetch(`${API_BASE_URL}/diary/entries`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
      } catch (error) {
        console.warn('API request failed, falling back to local data:', error);
        // Fallback to local data
        return retryPromise(() => getData(diaryEntries as DiaryEntry[]));
      }
    },

    /**
     * Get a single diary entry by ID
     */
    getDiaryEntryById: async (id: string): Promise<DiaryEntry | undefined> => {
      // Try to get data from API first
      try {
        const response = await fetch(`${API_BASE_URL}/diary/entries/${id}`);
        if (response.status === 404) return undefined;
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
      } catch (error) {
        console.warn('API request failed, falling back to local data:', error);
        // Fallback to local data
        return retryPromise(() => getById(diaryEntries as DiaryEntry[], id));
      }
    },

    /**
     * Get all diary categories
     */
    getCategories: async (): Promise<DiaryCategory[]> => {
      // Try to get data from API first
      try {
        const response = await fetch(`${API_BASE_URL}/diary/categories`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
      } catch (error) {
        console.warn('API request failed, falling back to local data:', error);
        // Fallback to local data
        return retryPromise(() => getData(diaryCategories as DiaryCategory[]));
      }
    },

    /**
     * Get a single diary category by ID
     */
    getCategoryById: async (id: string): Promise<DiaryCategory | undefined> => {
      // Try to get data from API first
      try {
        const response = await fetch(`${API_BASE_URL}/diary/categories/${id}`);
        if (response.status === 404) return undefined;
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
      } catch (error) {
        console.warn('API request failed, falling back to local data:', error);
        // Fallback to local data
        return retryPromise(() => getById(diaryCategories as DiaryCategory[], id));
      }
    },

    /**
     * Get all diary tags
     */
    getTags: async (): Promise<DiaryTag[]> => {
      // Try to get data from API first
      try {
        const response = await fetch(`${API_BASE_URL}/diary/tags`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
      } catch (error) {
        console.warn('API request failed, falling back to local data:', error);
        // Fallback to local data
        return retryPromise(() => getData(diaryTags as DiaryTag[]));
      }
    },

    /**
     * Get a single diary tag by ID
     */
    getTagById: async (id: string): Promise<DiaryTag | undefined> => {
      // Try to get data from API first
      try {
        const response = await fetch(`${API_BASE_URL}/diary/tags/${id}`);
        if (response.status === 404) return undefined;
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
      } catch (error) {
        console.warn('API request failed, falling back to local data:', error);
        // Fallback to local data
        return retryPromise(() => getById(diaryTags as DiaryTag[], id));
      }
    },

    /**
     * Get diary tags by IDs
     */
    getTagsByIds: async (ids: string[]): Promise<DiaryTag[]> => {
      // Try to get data from API first
      try {
        const params = new URLSearchParams({ ids: ids.join(',') });
        const response = await fetch(`${API_BASE_URL}/diary/tags/multiple?${params}`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
      } catch (error) {
        console.warn('API request failed, falling back to local data:', error);
        // Fallback to local data
        return retryPromise(() => getByIds(diaryTags as DiaryTag[], ids));
      }
    },

    /**
     * Get diary moods
     */
    getMoods: async (): Promise<DiaryMood[]> => {
      // Try to get data from API first
      try {
        const response = await fetch(`${API_BASE_URL}/diary/moods`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
      } catch (error) {
        console.warn('API request failed, falling back to local data:', error);
        // Fallback to local data
        return retryPromise(() => getData(diaryMoods as DiaryMood[]));
      }
    },

    /**
     * Get a single diary mood by ID
     */
    getMoodById: async (id: string): Promise<DiaryMood | undefined> => {
      // Try to get data from API first
      try {
        const response = await fetch(`${API_BASE_URL}/diary/moods/${id}`);
        if (response.status === 404) return undefined;
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
      } catch (error) {
        console.warn('API request failed, falling back to local data:', error);
        // Fallback to local data
        return retryPromise(() => getById(diaryMoods as DiaryMood[], id));
      }
    },

    /**
     * Get enriched diary entries with category and tags information
     */
    getEnrichedDiaryEntries: async () => {
      // Try to get enriched data from API first
      try {
        const response = await fetch(`${API_BASE_URL}/diary/entries/enriched`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
      } catch (error) {
        console.warn('API request failed, falling back to local data:', error);

        // Fallback to manual enrichment
        return retryPromise(async () => {
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
        });
      }
    },

    /**
     * Create a new diary entry
     */
    createDiaryEntry: async (data: DiaryEntryFormData): Promise<DiaryEntry> => {
      try {
        const response = await fetch(`${API_BASE_URL}/diary/entry`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Network response was not ok: ${errorText}`);
        }
        return await response.json();
      } catch (error) {
        console.error('Error creating diary entry:', error);
        throw error;
      }
    },

    /**
     * Update an existing diary entry
     */
    updateDiaryEntry: async (id: string, data: DiaryEntryFormData): Promise<DiaryEntry> => {
      try {
        const response = await fetch(`${API_BASE_URL}/diary/entry/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Network response was not ok: ${errorText}`);
        }
        return await response.json();
      } catch (error) {
        console.error('Error updating diary entry:', error);
        throw error;
      }
    },

    /**
     * Delete a diary entry
     */
    deleteDiaryEntry: async (id: string): Promise<void> => {
      try {
        const response = await fetch(`${API_BASE_URL}/diary/entry/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Network response was not ok: ${errorText}`);
        }
      } catch (error) {
        console.error('Error deleting diary entry:', error);
        throw error;
      }
    }
  };
}
