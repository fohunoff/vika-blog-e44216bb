
import { retryPromise } from '../utils';

export const API_BASE_URL = 'http://localhost:3001';

// Common fallback pattern for all diary API methods
export const apiFallback = async <T>(
  apiCall: () => Promise<T>,
  fallbackFn: () => Promise<T>,
  errorMessage: string = 'API request failed, falling back to local data'
): Promise<T> => {
  try {
    return await apiCall();
  } catch (error) {
    console.warn(errorMessage, error);
    return retryPromise(fallbackFn);
  }
};
