
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
    }
  };
}
