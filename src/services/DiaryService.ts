
import { DiaryEntry, DiaryMood } from "../types";

export interface DiaryTag {
  name: string;
  count: number;
}

const API_URL = 'http://localhost:3000/api';

export const DiaryService = {
  async getDiaryEntries(search?: string, mood?: string): Promise<DiaryEntry[]> {
    let url = `${API_URL}/diaries`;
    const params: string[] = [];
    
    if (search) {
      params.push(`search=${encodeURIComponent(search)}`);
    }
    
    if (mood) {
      params.push(`mood=${encodeURIComponent(mood)}`);
    }
    
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch diary entries');
    }
    
    return response.json();
  },
  
  async getDiaryEntryById(id: string): Promise<DiaryEntry> {
    const response = await fetch(`${API_URL}/diaries/${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch diary entry with id ${id}`);
    }
    
    return response.json();
  },
  
  async getMoods(): Promise<DiaryMood[]> {
    const response = await fetch(`${API_URL}/diaries/moods`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch moods');
    }
    
    return response.json();
  },
  
  async getTags(): Promise<DiaryTag[]> {
    const response = await fetch(`${API_URL}/diaries/tags`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch tags');
    }
    
    return response.json();
  }
};

export default DiaryService;
