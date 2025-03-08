import { Cafe, CafeCategory, CafeTag, CafePriceRange } from '../../types/models';
import cafesData from '../../data/cafes.json';
import cafeCategories from '../../data/cafe/cafe-categories.json';
import cafeTags from '../../data/cafe/cafe-tags.json';
import cafePriceRanges from '../../data/cafe/cafe-price-ranges.json';

/**
 * Base URL for API requests
 */
const API_BASE_URL = 'http://localhost:3001';

// Задержка для локальных данных
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function createCafesApi() {
  return {
    /**
     * Get all cafes
     */
    getCafes: async (): Promise<Cafe[]> => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const response = await fetch(`${API_BASE_URL}/cafes`, {
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) throw new Error('Failed to fetch cafes');
        return await response.json();
      } catch (error) {
        console.warn('Error fetching cafes from API, falling back to local data:', error);

        // Fallback to local data
        await delay(300); // Simulate network delay
        return cafesData as Cafe[];
      }
    },

    /**
     * Get a single cafe by ID
     */
    getCafeById: async (id: string): Promise<Cafe | undefined> => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(`${API_BASE_URL}/cafes/${id}`, {
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.status === 404) return undefined;
        if (!response.ok) throw new Error('Failed to fetch cafe');
        return await response.json();
      } catch (error) {
        console.warn(`Error fetching cafe with id ${id} from API, falling back to local data:`, error);

        // Fallback to local data
        await delay(200);
        return (cafesData as Cafe[]).find(cafe => cafe.id === id);
      }
    },

    /**
     * Get all cafe categories
     */
    getCategories: async (): Promise<CafeCategory[]> => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        // Обновленный URL-путь для категорий
        const response = await fetch(`${API_BASE_URL}/cafes/categories`, {
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) throw new Error('Failed to fetch cafe categories');
        return await response.json();
      } catch (error) {
        console.warn('Error fetching cafe categories from API, falling back to local data:', error);

        // Fallback to local data
        await delay(200);
        return cafeCategories as CafeCategory[];
      }
    },

    /**
     * Get all cafe tags
     */
    getTags: async (): Promise<CafeTag[]> => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        // Обновленный URL-путь для тегов
        const response = await fetch(`${API_BASE_URL}/cafes/tags`, {
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) throw new Error('Failed to fetch cafe tags');
        return await response.json();
      } catch (error) {
        console.warn('Error fetching cafe tags from API, falling back to local data:', error);

        // Fallback to local data
        await delay(200);
        return cafeTags as CafeTag[];
      }
    },

    /**
     * Get all cafe price ranges
     */
    getPriceRanges: async (): Promise<CafePriceRange[]> => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        // Обновленный URL-путь для ценовых диапазонов
        const response = await fetch(`${API_BASE_URL}/cafes/price-ranges`, {
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) throw new Error('Failed to fetch cafe price ranges');
        return await response.json();
      } catch (error) {
        console.warn('Error fetching cafe price ranges from API, falling back to local data:', error);

        // Fallback to local data
        await delay(200);
        return cafePriceRanges as CafePriceRange[];
      }
    },

    /**
     * Get enriched cafes with category and tag information
     */
    getEnrichedCafes: async (): Promise<(Cafe & { categories: string[], tags: string[] })[]> => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(`${API_BASE_URL}/cafes/enriched`, {
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) throw new Error('Failed to fetch enriched cafes');
        return await response.json();
      } catch (error) {
        console.warn('Error fetching enriched cafes from API, falling back to local enrichment:', error);

        // Fallback to local data and manual enrichment
        await delay(300);

        try {
          const cafes = cafesData as Cafe[];
          const categories = cafeCategories as CafeCategory[];
          const tags = cafeTags as CafeTag[];

          // Manually enrich cafes with category and tag information
          return cafes.map(cafe => {
            // Parse category IDs (могут быть в JSON формате или массивом)
            let categoryIds: string[] = [];
            if (typeof cafe.categoryIds === 'string') {
              try {
                categoryIds = JSON.parse(cafe.categoryIds);
              } catch (e) {
                categoryIds = cafe.categoryIds ? [cafe.categoryIds] : [];
              }
            } else if (Array.isArray(cafe.categoryIds)) {
              categoryIds = cafe.categoryIds;
            }

            // Parse tag IDs
            let tagIds: string[] = [];
            if (typeof cafe.tagIds === 'string') {
              try {
                tagIds = JSON.parse(cafe.tagIds);
              } catch (e) {
                tagIds = cafe.tagIds ? [cafe.tagIds] : [];
              }
            } else if (Array.isArray(cafe.tagIds)) {
              tagIds = cafe.tagIds;
            }

            // Get category names by IDs
            const categoryNames = categoryIds
                .map(id => categories.find(cat => cat.id === id)?.name)
                .filter(Boolean) as string[];

            // Get tag names by IDs
            const tagNames = tagIds
                .map(id => tags.find(tag => tag.id === id)?.name)
                .filter(Boolean) as string[];

            return {
              ...cafe,
              categories: categoryNames,
              tags: tagNames
            };
          });
        } catch (enrichError) {
          console.error('Error enriching cafes locally:', enrichError);

          // If enrichment fails, return basic data
          return (cafesData as Cafe[]).map(cafe => ({
            ...cafe,
            categories: [],
            tags: []
          }));
        }
      }
    }
  };
}
