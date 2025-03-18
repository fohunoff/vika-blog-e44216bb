
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Utility for creating classNames with Tailwind support
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility for formatting dates
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ru', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

// Utility for working with API
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
