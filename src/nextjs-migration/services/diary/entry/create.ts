
import { revalidatePath } from 'next/cache';
import { API_BASE_URL } from '../diaryServiceConfig';

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
