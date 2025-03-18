
import { revalidatePath } from 'next/cache';
import { API_BASE_URL } from '../diaryServiceConfig';

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
