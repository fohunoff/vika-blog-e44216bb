
// Базовый URL API
const API_BASE_URL = process.env.API_URL || 'http://localhost:3001';

/**
 * Функция для выполнения API-запросов с обработкой ошибок
 * @param url - путь запроса
 * @param options - опции запроса
 */
export async function fetchAPI<T>(
  url: string, 
  options: RequestInit = {},
  baseUrl = API_BASE_URL
): Promise<T> {
  const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
  
  try {
    console.log(`Fetching API: ${fullUrl}`);
    const response = await fetch(fullUrl, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

/**
 * Получение данных API с кэшированием
 */
export async function fetchCachedAPI<T>(
  url: string,
  options: RequestInit & { next?: { revalidate?: number } } = {}
): Promise<T> {
  // Устанавливаем время кэширования по умолчанию (1 час)
  const defaultOptions = {
    next: { revalidate: 3600 },
    ...options,
  };

  return fetchAPI<T>(url, defaultOptions);
}
