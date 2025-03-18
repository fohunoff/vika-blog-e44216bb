
import { DiaryEntry } from '@/types/diary';
import { revalidatePath } from 'next/cache';
import { API_BASE_URL, handleResponseError } from './diaryServiceConfig';

/**
 * Получение записи дневника по ID с дополнительными метаданными
 */
export async function getDiaryEntry(id: string): Promise<(DiaryEntry & {
  tags?: string[];
  category?: string;
  mood?: string;
}) | null> {
  try {
    // Поддержка как числовых, так и строковых ID
    const entryId = id.startsWith('diary-entry-') ? id : `diary-entry-${id}`;
    
    // Запрос данных записи с сервера (на стороне сервера Next.js)
    const response = await fetch(`${API_BASE_URL}/diary/entries/${entryId}`, { 
      next: { revalidate: 60 } // Кеширование на 60 секунд
    });
    
    if (response.status === 404) {
      return null;
    }
    
    if (!response.ok) {
      throw new Error(`Failed to fetch entry: ${response.statusText}`);
    }
    
    const entryData = await response.json();
    
    // Получение дополнительных метаданных одновременно
    const [categoriesResponse, tagsResponse, moodsResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/diary/categories`, { next: { revalidate: 3600 } }),
      fetch(`${API_BASE_URL}/diary/tags`, { next: { revalidate: 3600 } }),
      fetch(`${API_BASE_URL}/diary/moods`, { next: { revalidate: 3600 } })
    ]);
    
    const categories = await categoriesResponse.json();
    const tags = await tagsResponse.json();
    const moods = await moodsResponse.json();
    
    // Нормализация данных массивов
    const tagIds = Array.isArray(entryData.tagIds) ? entryData.tagIds :
                  (entryData.tagIds ? [entryData.tagIds] : []);
                  
    const categoryIds = Array.isArray(entryData.categoryIds) ? entryData.categoryIds :
                      [entryData.categoryId || entryData.categoryIds].filter(Boolean);
    
    const moodIds = Array.isArray(entryData.moodIds) ? entryData.moodIds :
                   [entryData.moodId || entryData.moodIds].filter(Boolean);
    
    // Получение связанных метаданных
    const categoryData = categoryIds.map(categoryId => 
      categories.find((category: any) => category.id === categoryId)
    ).filter(Boolean);
    
    const tagsData = tagIds.map(tagId => 
      tags.find((tag: any) => tag.id === tagId)
    ).filter(Boolean);
    
    const moodData = moodIds.map(moodId => 
      moods.find((mood: any) => mood.id === moodId)
    ).filter(Boolean);
    
    // Обогащение записи метаданными
    const enrichedEntry = {
      ...entryData,
      tags: tagsData.filter(Boolean).map((tag: any) => tag?.name),
      category: categoryData.filter(Boolean).find((category: any) => category)?.name,
      mood: moodData.filter(Boolean).find((mood: any) => mood)?.name,
      categoryIds,
      moodIds,
      tagIds
    };
    
    return enrichedEntry;
  } catch (error) {
    console.error('Error fetching entry:', error);
    throw error;
  }
}

/**
 * Получение связанных записей
 */
export async function getRelatedEntries(currentEntryId: string, 
  currentEntry: DiaryEntry & { category?: string; tags?: string[] }): Promise<(DiaryEntry & {
    tags?: string[];
    category?: string;
    mood?: string;
  })[]> {
  try {
    // Запрос к API (на стороне сервера Next.js)
    const response = await fetch(`${API_BASE_URL}/diary/entries/enriched`, { 
      next: { revalidate: 60 } 
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch related entries');
    }
    
    const allEntries = await response.json();
    
    // Поиск связанных записей
    const relatedEntries = allEntries
      .filter((e: any) => e.id !== currentEntryId) // Исключаем текущую запись
      .filter((e: any) => {
        const sameCategory = e.category === currentEntry.category;
        const hasMatchingTag = e.tags?.some((tag: string) => currentEntry.tags?.includes(tag));
        return sameCategory || hasMatchingTag;
      })
      .slice(0, 3); // Ограничение до 3 связанных записей
    
    return relatedEntries;
  } catch (error) {
    console.error('Error fetching related entries:', error);
    return [];
  }
}

/**
 * Получение всех записей дневника с метаданными
 */
export async function getAllDiaryEntries(): Promise<(DiaryEntry & {
  tags?: string[];
  category?: string;
  mood?: string;
})[]> {
  try {
    // Запрос данных с сервера (на стороне сервера Next.js)
    const response = await fetch(`${API_BASE_URL}/diary/entries/enriched`, { 
      next: { revalidate: 60 } 
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch entries: ${response.statusText}`);
    }
    
    const entries = await response.json();
    return entries;
  } catch (error) {
    console.error('Error fetching all diary entries:', error);
    return [];
  }
}

/**
 * Добавление новой записи (для API маршрутов)
 */
export async function createDiaryEntry(data: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/diary/entries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create entry: ${response.statusText}`);
    }
    
    revalidatePath('/diary');
    return await response.json();
  } catch (error) {
    console.error('Error creating diary entry:', error);
    throw error;
  }
}

/**
 * Обновление записи (для API маршрутов)
 */
export async function updateDiaryEntry(id: string, data: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/diary/entries/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update entry: ${response.statusText}`);
    }
    
    revalidatePath(`/diary/${id}`);
    revalidatePath('/diary');
    return await response.json();
  } catch (error) {
    console.error('Error updating diary entry:', error);
    throw error;
  }
}

/**
 * Удаление записи (для API маршрутов)
 */
export async function deleteDiaryEntry(id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/diary/entries/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete entry: ${response.statusText}`);
    }
    
    revalidatePath('/diary');
    return true;
  } catch (error) {
    console.error('Error deleting diary entry:', error);
    throw error;
  }
}
