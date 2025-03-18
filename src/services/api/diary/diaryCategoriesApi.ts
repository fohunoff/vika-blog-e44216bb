
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
    },

    /**
     * Create a new diary category
     */
    createCategory: async (data: { name: string; image?: string }): Promise<DiaryCategory> => {
      try {
        const response = await fetch(`${API_BASE_URL}/diary/categories`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
      } catch (error) {
        console.error('Error creating category:', error);
        throw error;
      }
    },

    /**
     * Update an existing diary category
     */
    updateCategory: async (id: string, data: { name: string; image?: string }): Promise<DiaryCategory> => {
      try {
        const response = await fetch(`${API_BASE_URL}/diary/categories/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
      } catch (error) {
        console.error('Error updating category:', error);
        throw error;
      }
    },

    /**
     * Delete a diary category
     */
    deleteCategory: async (id: string): Promise<void> => {
      try {
        const response = await fetch(`${API_BASE_URL}/diary/categories/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) throw new Error('Network response was not ok');
      } catch (error) {
        console.error('Error deleting category:', error);
        throw error;
      }
    }
  };
}
