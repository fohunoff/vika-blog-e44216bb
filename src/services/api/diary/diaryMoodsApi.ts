
import diaryMoods from '../../../data/diary/diary-moods.json';
import { getData, getById } from '../utils';
import { DiaryMood } from '../../../types/diary';
import { API_BASE_URL, apiFallback } from './diaryApiBase';

export function createDiaryMoodsApi() {
  return {
    /**
     * Get diary moods
     */
    getMoods: async (): Promise<DiaryMood[]> => {
      return apiFallback(
        async () => {
          const response = await fetch(`${API_BASE_URL}/diary/moods`);
          if (!response.ok) throw new Error('Network response was not ok');
          return await response.json();
        },
        () => getData(diaryMoods as DiaryMood[])
      );
    },

    /**
     * Get a single diary mood by ID
     */
    getMoodById: async (id: string): Promise<DiaryMood | undefined> => {
      return apiFallback(
        async () => {
          const response = await fetch(`${API_BASE_URL}/diary/moods/${id}`);
          if (response.status === 404) return undefined;
          if (!response.ok) throw new Error('Network response was not ok');
          return await response.json();
        },
        () => getById(diaryMoods as DiaryMood[], id)
      );
    },

    /**
     * Create a new diary mood
     */
    createMood: async (data: { name: string; icon?: string }): Promise<DiaryMood> => {
      try {
        const response = await fetch(`${API_BASE_URL}/diary/moods`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
      } catch (error) {
        console.error('Error creating mood:', error);
        throw error;
      }
    },

    /**
     * Update an existing diary mood
     */
    updateMood: async (id: string, data: { name: string; icon?: string }): Promise<DiaryMood> => {
      try {
        const response = await fetch(`${API_BASE_URL}/diary/moods/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
      } catch (error) {
        console.error('Error updating mood:', error);
        throw error;
      }
    },

    /**
     * Delete a diary mood
     */
    deleteMood: async (id: string): Promise<void> => {
      try {
        const response = await fetch(`${API_BASE_URL}/diary/moods/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) throw new Error('Network response was not ok');
      } catch (error) {
        console.error('Error deleting mood:', error);
        throw error;
      }
    }
  };
}
