
import cafes from '../../data/cafes.json';
import cafeCategories from '../../data/cafe/cafe-categories.json';
import cafeTags from '../../data/cafe/cafe-tags.json';
import cafePriceRanges from '../../data/cafe/cafe-price-ranges.json';
import { getData, getById, getByIds, enrichWithRelated } from './utils';
import { Cafe, CafeCategory, CafeTag, CafePriceRange } from '../../types/models';

/**
 * Helper function to retry a promise a specific number of times
 */
async function retryPromise<T>(
  promiseFn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 500
): Promise<T> {
  let lastError: any;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await promiseFn();
    } catch (error) {
      lastError = error;
      console.log(`Attempt ${i + 1} failed, retrying...`);
      
      // Wait before next retry
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  // If we've exhausted all retries, throw the last error
  throw lastError;
}

const API_URL = 'http://localhost:3001';

export function createCafesApi() {
  return {
    /**
     * Get all cafes
     */
    getCafes: async (): Promise<Cafe[]> => {
      // Try to get data from API first
      try {
        const response = await fetch(`${API_URL}/cafes`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
      } catch (error) {
        console.warn('API request failed, falling back to local data:', error);
        // Fallback to local data
        return retryPromise(() => getData(cafes as Cafe[]));
      }
    },
    
    /**
     * Get a single cafe by ID
     */
    getCafeById: async (id: string): Promise<Cafe | undefined> => {
      // Try to get data from API first
      try {
        const response = await fetch(`${API_URL}/cafes/${id}`);
        if (response.status === 404) return undefined;
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
      } catch (error) {
        console.warn('API request failed, falling back to local data:', error);
        // Fallback to local data
        return retryPromise(() => getById(cafes as Cafe[], id));
      }
    },
    
    /**
     * Get all cafe categories
     */
    getCategories: async (): Promise<CafeCategory[]> => {
      // Try to get data from API first
      try {
        const response = await fetch(`${API_URL}/cafes/categories`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
      } catch (error) {
        console.warn('API request failed, falling back to local data:', error);
        // Fallback to local data
        return retryPromise(() => getData(cafeCategories as CafeCategory[]));
      }
    },
    
    /**
     * Get a single cafe category by ID
     */
    getCategoryById: async (id: string): Promise<CafeCategory | undefined> => {
      // Try to get data from API first
      try {
        const response = await fetch(`${API_URL}/cafes/categories/${id}`);
        if (response.status === 404) return undefined;
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
      } catch (error) {
        console.warn('API request failed, falling back to local data:', error);
        // Fallback to local data
        return retryPromise(() => getById(cafeCategories as CafeCategory[], id));
      }
    },
    
    /**
     * Get cafe categories by IDs
     */
    getCategoriesByIds: async (ids: string[]): Promise<CafeCategory[]> => {
      // Try to get data from API first
      try {
        const response = await fetch(`${API_URL}/cafes/categories`);
        if (!response.ok) throw new Error('Network response was not ok');
        const allCategories = await response.json();
        return allCategories.filter((category: CafeCategory) => ids.includes(category.id));
      } catch (error) {
        console.warn('API request failed, falling back to local data:', error);
        // Fallback to local data
        return retryPromise(() => getByIds(cafeCategories as CafeCategory[], ids));
      }
    },
    
    /**
     * Get all cafe tags
     */
    getTags: async (): Promise<CafeTag[]> => {
      // Try to get data from API first
      try {
        const response = await fetch(`${API_URL}/cafes/tags`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
      } catch (error) {
        console.warn('API request failed, falling back to local data:', error);
        // Fallback to local data
        return retryPromise(() => getData(cafeTags as CafeTag[]));
      }
    },
    
    /**
     * Get a single cafe tag by ID
     */
    getTagById: async (id: string): Promise<CafeTag | undefined> => {
      // Try to get data from API first
      try {
        const response = await fetch(`${API_URL}/cafes/tags/${id}`);
        if (response.status === 404) return undefined;
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
      } catch (error) {
        console.warn('API request failed, falling back to local data:', error);
        // Fallback to local data
        return retryPromise(() => getById(cafeTags as CafeTag[], id));
      }
    },
    
    /**
     * Get cafe tags by IDs
     */
    getTagsByIds: async (ids: string[]): Promise<CafeTag[]> => {
      // Try to get data from API first
      try {
        const response = await fetch(`${API_URL}/cafes/tags/byIds`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ids }),
        });
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
      } catch (error) {
        console.warn('API request failed, falling back to local data:', error);
        // Fallback to local data
        return retryPromise(() => getByIds(cafeTags as CafeTag[], ids));
      }
    },
    
    /**
     * Get all cafe price ranges
     */
    getPriceRanges: async (): Promise<CafePriceRange[]> => {
      // Try to get data from API first
      try {
        const response = await fetch(`${API_URL}/cafes/price-ranges`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
      } catch (error) {
        console.warn('API request failed, falling back to local data:', error);
        // Fallback to local data
        return retryPromise(() => getData(cafePriceRanges as CafePriceRange[]));
      }
    },
    
    /**
     * Get a single cafe price range by ID
     */
    getPriceRangeById: async (id: string): Promise<CafePriceRange | undefined> => {
      // Try to get data from API first
      try {
        const response = await fetch(`${API_URL}/cafes/price-ranges/${id}`);
        if (response.status === 404) return undefined;
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
      } catch (error) {
        console.warn('API request failed, falling back to local data:', error);
        // Fallback to local data
        return retryPromise(() => getById(cafePriceRanges as CafePriceRange[], id));
      }
    },
    
    /**
     * Get price range by name
     */
    getPriceRangeByName: async (name: string): Promise<CafePriceRange | undefined> => {
      // First get all price ranges
      try {
        const priceRanges = await this.getPriceRanges();
        return priceRanges.find(range => range.name === name);
      } catch (error) {
        console.warn('Failed to get price range by name:', error);
        // Fallback to local data
        return retryPromise(() => getData(cafePriceRanges as CafePriceRange[])
          .then(ranges => ranges.find(range => range.name === name)));
      }
    },
    
    /**
     * Get enriched cafes with category and tag information
     */
    getEnrichedCafes: async (): Promise<(Cafe & { categories: string[], tags: string[] })[]> => {
      // Try to get enriched data from API first
      try {
        const response = await fetch(`${API_URL}/cafes/enriched`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
      } catch (error) {
        console.warn('API request failed, falling back to local data:', error);
        // Fallback to local data
        return retryPromise(async () => {
          const allCafes = await getData(cafes as Cafe[]);
          const categories = await getData(cafeCategories as CafeCategory[]);
          const tags = await getData(cafeTags as CafeTag[]);
          
          return allCafes.map(cafe => ({
            ...cafe,
            categories: cafe.categoryIds
              .map(id => categories.find(c => c.id === id)?.name)
              .filter(Boolean) as string[],
            tags: cafe.tagIds
              .map(id => tags.find(t => t.id === id)?.name)
              .filter(Boolean) as string[]
          }));
        });
      }
    },
    
    /**
     * Create a new cafe
     */
    createCafe: async (cafeData: Omit<Cafe, 'id'>): Promise<{ id: string }> => {
      const response = await fetch(`${API_URL}/cafes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cafeData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create cafe');
      }
      
      return response.json();
    },
    
    /**
     * Update an existing cafe
     */
    updateCafe: async (id: string, cafeData: Partial<Cafe>): Promise<void> => {
      const response = await fetch(`${API_URL}/cafes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cafeData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update cafe');
      }
    },
    
    /**
     * Delete a cafe
     */
    deleteCafe: async (id: string): Promise<void> => {
      const response = await fetch(`${API_URL}/cafes/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete cafe');
      }
    }
  };
}
