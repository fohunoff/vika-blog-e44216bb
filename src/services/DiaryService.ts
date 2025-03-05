
import { DiaryEntry, DiaryMood } from '../types';

const API_URL = 'http://localhost:3000/api';

export const DiaryService = {
  /**
   * Get all diary entries with optional filters
   */
  async getAllEntries(searchQuery: string = '', mood: string | null = null): Promise<DiaryEntry[]> {
    let url = `${API_URL}/diary`;
    const params = new URLSearchParams();
    
    if (searchQuery) {
      params.append('search', searchQuery);
    }
    
    if (mood) {
      params.append('mood', mood);
    }
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch diary entries');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching diary entries:', error);
      return [];
    }
  },
  
  /**
   * Get a diary entry by ID
   */
  async getEntryById(id: string): Promise<DiaryEntry | null> {
    try {
      const response = await fetch(`${API_URL}/diary/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch diary entry');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching diary entry:', error);
      return null;
    }
  },
  
  /**
   * Get all moods
   */
  async getAllMoods(): Promise<DiaryMood[]> {
    try {
      const response = await fetch(`${API_URL}/diary/moods`);
      if (!response.ok) {
        throw new Error('Failed to fetch moods');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching moods:', error);
      return [];
    }
  },
  
  /**
   * Get all tags with counts
   */
  async getAllTags(): Promise<{ name: string; count: number }[]> {
    try {
      const response = await fetch(`${API_URL}/diary/tags`);
      if (!response.ok) {
        throw new Error('Failed to fetch tags');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching tags:', error);
      return [];
    }
  }
};
