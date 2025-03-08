import { Cafe, CafeCategory, CafeTag, CafePriceRange } from '../../types/models';

/**
 * Base URL for API requests
 */
const API_BASE_URL = 'http://localhost:3001';

export function createCafesApi() {
  return {
    /**
     * Get all cafes
     */
    getCafes: async (): Promise<Cafe[]> => {
      try {
        const response = await fetch(`${API_BASE_URL}/cafes`);
        if (!response.ok) throw new Error('Failed to fetch cafes');
        return await response.json();
      } catch (error) {
        console.error('Error fetching cafes:', error);
        throw error;
      }
    },

    /**
     * Get a single cafe by ID
     */
    getCafeById: async (id: string): Promise<Cafe | undefined> => {
      try {
        const response = await fetch(`${API_BASE_URL}/cafes/${id}`);
        if (response.status === 404) return undefined;
        if (!response.ok) throw new Error('Failed to fetch cafe');
        return await response.json();
      } catch (error) {
        console.error(`Error fetching cafe with id ${id}:`, error);
        throw error;
      }
    },

    /**
     * Get all cafe categories
     */
    getCategories: async (): Promise<CafeCategory[]> => {
      try {
        const response = await fetch(`${API_BASE_URL}/cafes/categories`);
        if (!response.ok) throw new Error('Failed to fetch cafe categories');
        return await response.json();
      } catch (error) {
        console.error('Error fetching cafe categories:', error);
        throw error;
      }
    },

    /**
     * Get a single cafe category by ID
     */
    getCategoryById: async (id: string): Promise<CafeCategory | undefined> => {
      try {
        const response = await fetch(`${API_BASE_URL}/cafes/categories/${id}`);
        if (response.status === 404) return undefined;
        if (!response.ok) throw new Error('Failed to fetch cafe category');
        return await response.json();
      } catch (error) {
        console.error(`Error fetching cafe category with id ${id}:`, error);
        throw error;
      }
    },

    /**
     * Get cafe categories by IDs
     */
    getCategoriesByIds: async (ids: string[]): Promise<CafeCategory[]> => {
      try {
        const allCategories = await this.getCategories();
        return allCategories.filter((category) => ids.includes(category.id));
      } catch (error) {
        console.error('Error fetching cafe categories by IDs:', error);
        throw error;
      }
    },

    /**
     * Get all cafe tags
     */
    getTags: async (): Promise<CafeTag[]> => {
      try {
        const response = await fetch(`${API_BASE_URL}/cafes/tags`);
        if (!response.ok) throw new Error('Failed to fetch cafe tags');
        return await response.json();
      } catch (error) {
        console.error('Error fetching cafe tags:', error);
        throw error;
      }
    },

    /**
     * Get a single cafe tag by ID
     */
    getTagById: async (id: string): Promise<CafeTag | undefined> => {
      try {
        const response = await fetch(`${API_BASE_URL}/cafes/tags/${id}`);
        if (response.status === 404) return undefined;
        if (!response.ok) throw new Error('Failed to fetch cafe tag');
        return await response.json();
      } catch (error) {
        console.error(`Error fetching cafe tag with id ${id}:`, error);
        throw error;
      }
    },

    /**
     * Get cafe tags by IDs
     */
    getTagsByIds: async (ids: string[]): Promise<CafeTag[]> => {
      try {
        const response = await fetch(`${API_BASE_URL}/cafes/tags/byIds`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ids }),
        });
        if (!response.ok) throw new Error('Failed to fetch cafe tags by IDs');
        return await response.json();
      } catch (error) {
        console.error('Error fetching cafe tags by IDs:', error);
        throw error;
      }
    },

    /**
     * Get all cafe price ranges
     */
    getPriceRanges: async (): Promise<CafePriceRange[]> => {
      try {
        const response = await fetch(`${API_BASE_URL}/cafes/price-ranges`);
        if (!response.ok) throw new Error('Failed to fetch cafe price ranges');
        return await response.json();
      } catch (error) {
        console.error('Error fetching cafe price ranges:', error);
        throw error;
      }
    },

    /**
     * Get a single cafe price range by ID
     */
    getPriceRangeById: async (id: string): Promise<CafePriceRange | undefined> => {
      try {
        const response = await fetch(`${API_BASE_URL}/cafes/price-ranges/${id}`);
        if (response.status === 404) return undefined;
        if (!response.ok) throw new Error('Failed to fetch cafe price range');
        return await response.json();
      } catch (error) {
        console.error(`Error fetching cafe price range with id ${id}:`, error);
        throw error;
      }
    },

    /**
     * Get enriched cafes with category and tag information
     */
    getEnrichedCafes: async (): Promise<(Cafe & { categories: string[], tags: string[] })[]> => {
      try {
        const response = await fetch(`${API_BASE_URL}/cafes/enriched`);
        if (!response.ok) throw new Error('Failed to fetch enriched cafes');
        return await response.json();
      } catch (error) {
        console.error('Error fetching enriched cafes:', error);
        throw error;
      }
    }
  };
}
