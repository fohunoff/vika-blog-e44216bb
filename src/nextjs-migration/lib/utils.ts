
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';

/**
 * Форматирует дату в читаемый формат на русском языке
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, 'd MMMM yyyy', { locale: ru });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
}

/**
 * Выполняет fetch запрос к API
 */
export async function fetchAPI(endpoint: string, options?: RequestInit) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
}
