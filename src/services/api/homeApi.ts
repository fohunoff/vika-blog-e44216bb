
import homeHighlights from '../../data/home-highlights.json';
import homeCategories from '../../data/home-categories.json';
import homeTags from '../../data/home-tags.json';
import highlightTypes from '../../data/highlights-types.json';
import { getData, getById, getByIds, enrichWithRelated } from './utils';
import { HomeCategory, HomeHighlight, HomeHighlightType, HomeTag } from '../../types/models';

export function createHomeApi() {
  return {
    /**
     * Get all home highlights
     */
    getHighlights: (): Promise<HomeHighlight[]> => {
      return getData(homeHighlights as HomeHighlight[]);
    },

    /**
     * Get a single highlight by ID
     */
    getHighlightById: (id: string): Promise<HomeHighlight | undefined> => {
      return getById(homeHighlights as HomeHighlight[], id);
    },
    
    /**
     * Get all highlight types
     */
    getHighlightTypes: (): Promise<HomeHighlightType[]> => {
      return getData(highlightTypes as HomeHighlightType[]);
    },
    
    /**
     * Get a single highlight type by ID
     */
    getHighlightTypeById: (id: string): Promise<HomeHighlightType | undefined> => {
      return getById(highlightTypes as HomeHighlightType[], id);
    },

    /**
     * Get all home categories
     */
    getCategories: (): Promise<HomeCategory[]> => {
      return getData(homeCategories as HomeCategory[]);
    },
    
    /**
     * Get a single home category by ID
     */
    getCategoryById: (id: string): Promise<HomeCategory | undefined> => {
      return getById(homeCategories as HomeCategory[], id);
    },

    /**
     * Get all home tags
     */
    getTags: (): Promise<HomeTag[]> => {
      return getData(homeTags as HomeTag[]);
    },
    
    /**
     * Get a single home tag by ID
     */
    getTagById: (id: string): Promise<HomeTag | undefined> => {
      return getById(homeTags as HomeTag[], id);
    },
    
    /**
     * Get home tags by IDs
     */
    getTagsByIds: (ids: string[]): Promise<HomeTag[]> => {
      return getByIds(homeTags as HomeTag[], ids);
    },

    /**
     * Get highlights with enriched type information
     */
    getEnrichedHighlights: async (): Promise<HomeHighlight[]> => {
      const highlights = await getData(homeHighlights as HomeHighlight[]);
      const types = await getData(highlightTypes as HomeHighlightType[]);
      
      return highlights.map(highlight => ({
        ...highlight,
        type: types.find(type => type.id === highlight.typeId)?.name || highlight.type
      }));
    }
  };
}
