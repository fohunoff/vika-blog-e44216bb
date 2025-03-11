
import diaryCategories from '../../../data/diary/diary-categories.json';
import { getData, getById } from '../utils';
import { DiaryCategory } from '../../../types/diary';
import { API_BASE_URL, apiFallback } from './diaryApiBase';

export function createDiaryCategoriesApi() {
  return {
    /**
     * Get all diary categories
     */
    getCategories: async (): Promise<DiaryCategory[]> => {
      return apiFallback(
        async () => {
          const response = await fetch(`${API_BASE_URL}/diary/categories`);
          if (!response.ok) throw new Error('Network response was not ok');
          return await response.json();
        },
        () => getData(diaryCategories as DiaryCategory[])
      );
    },

    /**
     * Get a single diary category by ID
     */
    getCategoryById: async (id: string): Promise<DiaryCategory | undefined> => {
      return apiFallback(
        async () => {
          const response = await fetch(`${API_BASE_URL}/diary/categories/${id}`);
          if (response.status === 404) return undefined;
          if (!response.ok) throw new Error('Network response was not ok');
          return await response.json();
        },
        () => getById(diaryCategories as DiaryCategory[], id)
      );
    }
  };
}
