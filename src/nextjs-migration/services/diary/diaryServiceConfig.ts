
/**
 * Shared configuration for diary services
 */

// URL for API requests
export const API_BASE_URL = process.env.API_URL || 'http://localhost:3001';

/**
 * Helper function to handle response errors
 */
export const handleResponseError = (response: Response, notFoundMessage?: string): never => {
  if (response.status === 404 && notFoundMessage) {
    throw new Error(notFoundMessage);
  }
  throw new Error(`API error: ${response.statusText}`);
};
