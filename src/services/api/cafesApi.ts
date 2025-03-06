
import cafes from '../../data/cafes.json';
import cafeCategories from '../../data/cafe/cafe-categories.json';
import cafeTags from '../../data/cafe/cafe-tags.json';
import cafePriceRanges from '../../data/cafe/cafe-price-ranges.json';
import { getData, getById, getByIds, enrichWithRelated } from './utils';
import { Cafe, CafeCategory, CafeTag, CafePriceRange } from '../../types/models';

export function createCafesApi() {
  return {
    /**
     * Get all cafes
     */
    getCafes: (): Promise<Cafe[]> => {
      return getData(cafes as Cafe[]);
    },
    
    /**
     * Get a single cafe by ID
     */
    getCafeById: (id: string): Promise<Cafe | undefined> => {
      return getById(cafes as Cafe[], id);
    },
    
    /**
     * Get all cafe categories
     */
    getCategories: (): Promise<CafeCategory[]> => {
      return getData(cafeCategories as CafeCategory[]);
    },
    
    /**
     * Get a single cafe category by ID
     */
    getCategoryById: (id: string): Promise<CafeCategory | undefined> => {
      return getById(cafeCategories as CafeCategory[], id);
    },
    
    /**
     * Get cafe categories by IDs
     */
    getCategoriesByIds: (ids: string[]): Promise<CafeCategory[]> => {
      return getByIds(cafeCategories as CafeCategory[], ids);
    },
    
    /**
     * Get all cafe tags
     */
    getTags: (): Promise<CafeTag[]> => {
      return getData(cafeTags as CafeTag[]);
    },
    
    /**
     * Get a single cafe tag by ID
     */
    getTagById: (id: string): Promise<CafeTag | undefined> => {
      return getById(cafeTags as CafeTag[], id);
    },
    
    /**
     * Get cafe tags by IDs
     */
    getTagsByIds: (ids: string[]): Promise<CafeTag[]> => {
      return getByIds(cafeTags as CafeTag[], ids);
    },
    
    /**
     * Get all cafe price ranges
     */
    getPriceRanges: (): Promise<CafePriceRange[]> => {
      return getData(cafePriceRanges as CafePriceRange[]);
    },
    
    /**
     * Get a single cafe price range by ID
     */
    getPriceRangeById: (id: string): Promise<CafePriceRange | undefined> => {
      return getById(cafePriceRanges as CafePriceRange[], id);
    },
    
    /**
     * Get price range by name
     */
    getPriceRangeByName: (name: string): Promise<CafePriceRange | undefined> => {
      return getData(cafePriceRanges as CafePriceRange[])
        .then(ranges => ranges.find(range => range.name === name));
    },
    
    /**
     * Get enriched cafes with category and tag information
     */
    getEnrichedCafes: async (): Promise<(Cafe & { categories: string[], tags: string[] })[]> => {
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
    }
  };
}
