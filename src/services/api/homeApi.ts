
import homeArticles from '../../data/home-articles.json';
import homeCategories from '../../data/home-categories.json';
import homeTags from '../../data/home-tags.json';
import highlightTypes from '../../data/highlights-types.json';
import { getData, getById, getByIds, enrichWithRelated } from './utils';
import { HomeCategory, HomeHighlight, HomeHighlightType, HomeTag, HomeArticle } from '../../types/models';

export function createHomeApi() {
  return {
    /**
     * Get all home articles
     */
    getArticles: (): Promise<HomeArticle[]> => {
      return getData(homeArticles as HomeArticle[]);
    },

    /**
     * Get highlighted articles (for the Highlights section)
     */
    getHighlights: (): Promise<HomeArticle[]> => {
      return getData((homeArticles as HomeArticle[]).filter(article => article.isHighlight));
    },

    /**
     * Get a single article by ID
     */
    getArticleById: (id: string): Promise<HomeArticle | undefined> => {
      return getById(homeArticles as HomeArticle[], id);
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
     * Get articles with enriched type information
     */
    getEnrichedArticles: async (): Promise<HomeArticle[]> => {
      const articles = await getData(homeArticles as HomeArticle[]);
      const types = await getData(highlightTypes as HomeHighlightType[]);
      
      return articles.map(article => ({
        ...article,
        type: article.typeId ? types.find(type => type.id === article.typeId)?.name || article.type : article.type
      }));
    }
  };
}
