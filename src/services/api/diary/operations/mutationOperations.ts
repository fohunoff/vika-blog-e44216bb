
import { DiaryEntry, DiaryEntryFormData } from '../../../../types/diary';
import { API_BASE_URL } from '../diaryApiBase';
import { prepareEntryData, processEntryResponse } from '../utils/arrayUtils';

/**
 * API operations for creating, updating, and deleting diary entries
 */
export const mutationDiaryOperations = () => ({
  /**
   * Create a new diary entry
   */
  createDiaryEntry: async (data: DiaryEntryFormData): Promise<DiaryEntry> => {
    try {
      // Log the data to be sent
      console.log("Creating diary entry with data (before processing):", data);
      
      // Prepare data with properly formatted arrays
      const preparedData = prepareEntryData(data);
      
      console.log("Creating diary entry with data (after processing):", preparedData);
      
      const response = await fetch(`${API_BASE_URL}/diary/entries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preparedData),
      });
      
      if (!response.ok) throw new Error('Network response was not ok');
      const result = await response.json();
      
      // Process the result to ensure arrays are correctly handled
      const processedResult = processEntryResponse(result);
      
      console.log("Processed result:", processedResult);
      return processedResult;
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
      // Log the data to be sent
      console.log("Updating diary entry with data (before processing):", data);
      
      // Prepare data with properly formatted arrays
      const preparedData = prepareEntryData(data);
      
      console.log("Updating diary entry with data (after processing):", preparedData);
      
      const response = await fetch(`${API_BASE_URL}/diary/entries/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preparedData),
      });
      
      if (!response.ok) throw new Error('Network response was not ok');
      const result = await response.json();
      
      // Process the result to ensure arrays are correctly handled
      const processedResult = processEntryResponse(result);
      
      console.log("Processed result:", processedResult);
      return processedResult;
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
});
