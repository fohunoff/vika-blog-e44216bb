
import { revalidatePath } from 'next/cache';
import { API_BASE_URL } from '../diaryServiceConfig';

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
