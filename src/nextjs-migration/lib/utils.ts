
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Утилита для создания classNames с поддержкой Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Утилита для форматирования даты
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ru', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

// Утилита для работы с API
export async function fetchAPI(endpoint: string, options?: RequestInit) {
  const API_BASE_URL = process.env.API_URL || 'http://localhost:3001';
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  
  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error(`API error: ${response.statusText}`);
  }
  
  return response.json();
}
