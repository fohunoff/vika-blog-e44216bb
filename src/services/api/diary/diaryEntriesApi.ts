
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
        console.log("Отправка данных на сервер (создание):", data);
        
        const response = await fetch(`${API_BASE_URL}/diary/entries`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        
        if (!response.ok) throw new Error('Network response was not ok');
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
        console.log("Отправка данных на сервер (обновление):", data);
        
        const response = await fetch(`${API_BASE_URL}/diary/entries/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        
        if (!response.ok) throw new Error('Network response was not ok');
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
