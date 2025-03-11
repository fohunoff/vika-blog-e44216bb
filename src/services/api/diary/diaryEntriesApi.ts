
import diaryEntries from '../../../data/diary.json';
import diaryCategories from '../../../data/diary/diary-categories.json';
import diaryTags from '../../../data/diary/diary-tags.json';
import diaryMoods from '../../../data/diary/diary-moods.json';
import { getData, getById } from '../utils';
import { DiaryEntry, DiaryCategory, DiaryTag, DiaryMood, DiaryEntryFormData } from '../../../types/diary';
import { API_BASE_URL, apiFallback } from './diaryApiBase';

export function createDiaryEntriesApi() {
  return {
    /**
     * Get all diary entries
     */
    getDiaryEntries: async (): Promise<DiaryEntry[]> => {
      return apiFallback(
        async () => {
          const response = await fetch(`${API_BASE_URL}/diary/entries`);
          if (!response.ok) throw new Error('Network response was not ok');
          return await response.json();
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
          return await response.json();
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
          return await response.json();
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
    },

    /**
     * Create a new diary entry
     */
    createDiaryEntry: async (data: DiaryEntryFormData): Promise<DiaryEntry> => {
      try {
        // Ensure that all arrays are properly handled and not stringified again
        const preparedData = {
          ...data,
          categoryIds: Array.isArray(data.categoryIds) ? data.categoryIds : [],
          tagIds: Array.isArray(data.tagIds) ? data.tagIds : [],
          moodIds: Array.isArray(data.moodIds) ? data.moodIds : []
        };
        
        console.log("Отправка данных на сервер (создание). Raw:", data);
        console.log("Отправка данных на сервер (создание). Prepared:", preparedData);
        
        const response = await fetch(`${API_BASE_URL}/diary/entries`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(preparedData),
        });
        
        if (!response.ok) throw new Error('Network response was not ok');
        const result = await response.json();
        
        // Ensure arrays are arrays when returning
        return {
          ...result,
          tagIds: Array.isArray(result.tagIds) ? result.tagIds 
                 : typeof result.tagIds === 'string' ? JSON.parse(result.tagIds as unknown as string) 
                 : [],
          categoryIds: Array.isArray(result.categoryIds) ? result.categoryIds 
                      : typeof result.categoryIds === 'string' ? JSON.parse(result.categoryIds as unknown as string) 
                      : [],
          moodIds: Array.isArray(result.moodIds) ? result.moodIds 
                  : typeof result.moodIds === 'string' ? JSON.parse(result.moodIds as unknown as string) 
                  : []
        };
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
        // Ensure that all arrays are properly handled and not stringified again
        const preparedData = {
          ...data,
          categoryIds: Array.isArray(data.categoryIds) ? data.categoryIds : [],
          tagIds: Array.isArray(data.tagIds) ? data.tagIds : [],
          moodIds: Array.isArray(data.moodIds) ? data.moodIds : []
        };
        
        console.log("Отправка данных на сервер (обновление). Raw:", data);
        console.log("Отправка данных на сервер (обновление). Prepared:", preparedData);
        
        const response = await fetch(`${API_BASE_URL}/diary/entries/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(preparedData),
        });
        
        if (!response.ok) throw new Error('Network response was not ok');
        const result = await response.json();
        
        // Ensure arrays are arrays when returning
        return {
          ...result,
          tagIds: Array.isArray(result.tagIds) ? result.tagIds 
                 : typeof result.tagIds === 'string' ? JSON.parse(result.tagIds as unknown as string) 
                 : [],
          categoryIds: Array.isArray(result.categoryIds) ? result.categoryIds 
                      : typeof result.categoryIds === 'string' ? JSON.parse(result.categoryIds as unknown as string) 
                      : [],
          moodIds: Array.isArray(result.moodIds) ? result.moodIds 
                  : typeof result.moodIds === 'string' ? JSON.parse(result.moodIds as unknown as string) 
                  : []
        };
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
        const response = await fetch(`${API_BASE_URL}/diary/entries/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Network response was not ok');
      } catch (error) {
        console.error('Error deleting diary entry:', error);
        throw error;
      }
    }
  };
}
