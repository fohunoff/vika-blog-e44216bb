
import { API_BASE_URL } from './diaryServiceConfig';

/**
 * Получение всех настроений
 */
export async function getDiaryMoods() {
  try {
    const response = await fetch(`${API_BASE_URL}/diary/moods`, { 
      next: { revalidate: 3600 } 
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch moods: ${response.statusText}`);
    }
    
    const moods = await response.json();
    return moods;
  } catch (error) {
    console.error('Error fetching diary moods:', error);
    return [];
  }
}

/**
 * Получение всех категорий
 */
export async function getDiaryCategories() {
  try {
    const response = await fetch(`${API_BASE_URL}/diary/categories`, { 
      next: { revalidate: 3600 } 
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }
    
    const categories = await response.json();
    return categories;
  } catch (error) {
    console.error('Error fetching diary categories:', error);
    return [];
  }
}

/**
 * Получение всех тегов
 */
export async function getDiaryTags() {
  try {
    const response = await fetch(`${API_BASE_URL}/diary/tags`, { 
      next: { revalidate: 3600 } 
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch tags: ${response.statusText}`);
    }
    
    const tags = await response.json();
    return tags;
  } catch (error) {
    console.error('Error fetching diary tags:', error);
    return [];
  }
}
