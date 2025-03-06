
import cozyArticles from '../../data/cozy.json';
import cozyCategories from '../../data/cozy/cozy-categories.json';
import cozyTags from '../../data/cozy/cozy-tags.json';
import cozyHighlightTypes from '../../data/cozy/cozy-highlights-types.json';

import { 
  getData, 
  getById, 
  getByIds, 
  enrichWithRelated, 
  paginateData, 
  PaginationOptions, 
  PaginatedResponse 
} from './utils';

import { CozyCategory, CozyHighlight, CozyHighlightType, CozyTag, CozyArticle, MainFeaturedSection } from '../../types/models';

export function createCozyApi() {
  return {
    /**
     * Get all cozy articles
     */
    getArticles: (): Promise<CozyArticle[]> => {
      return getData(cozyArticles as CozyArticle[]);
    },

    /**
     * Get paginated cozy articles
     */
    getPaginatedArticles: (options?: PaginationOptions): Promise<PaginatedResponse<CozyArticle>> => {
      return getData(cozyArticles as CozyArticle[]).then(articles => {
        return paginateData(articles, options);
      });
    },

    /**
     * Get highlighted articles (for the Highlights section)
     */
    getHighlights: (): Promise<CozyArticle[]> => {
      return getData((cozyArticles as CozyArticle[]).filter(article => article.isHighlight));
    },

    /**
     * Get paginated highlighted articles
     */
    getPaginatedHighlights: (options?: PaginationOptions): Promise<PaginatedResponse<CozyArticle>> => {
      return getData((cozyArticles as CozyArticle[]).filter(article => article.isHighlight))
        .then(highlights => {
          return paginateData(highlights, options);
        });
    },

    /**
     * Get a single article by ID
     */
    getArticleById: (id: string): Promise<CozyArticle | undefined> => {
      return getById(cozyArticles as CozyArticle[], id);
    },

    /**
     * Get all highlight types
     */
    getHighlightTypes: (): Promise<CozyHighlightType[]> => {
      return getData(cozyHighlightTypes as CozyHighlightType[]);
    },

    /**
     * Get a single highlight type by ID
     */
    getHighlightTypeById: (id: string): Promise<CozyHighlightType | undefined> => {
      return getById(cozyHighlightTypes as CozyHighlightType[], id);
    },

    /**
     * Get all cozy categories
     */
    getCategories: (): Promise<CozyCategory[]> => {
      return getData(cozyCategories as CozyCategory[]);
    },

    /**
     * Get a single cozy category by ID
     */
    getCategoryById: (id: string): Promise<CozyCategory | undefined> => {
      return getById(cozyCategories as CozyCategory[], id);
    },

    /**
     * Get all cozy tags
     */
    getTags: (): Promise<CozyTag[]> => {
      return getData(cozyTags as CozyTag[]);
    },

    /**
     * Get a single cozy tag by ID
     */
    getTagById: (id: string): Promise<CozyTag | undefined> => {
      return getById(cozyTags as CozyTag[], id);
    },

    /**
     * Get cozy tags by IDs
     */
    getTagsByIds: (ids: string[]): Promise<CozyTag[]> => {
      return getByIds(cozyTags as CozyTag[], ids);
    },

    /**
     * Get articles with enriched type information
     */
    getEnrichedArticles: async (): Promise<CozyArticle[]> => {
      const articles = await getData(cozyArticles as CozyArticle[]);
      const types = await getData(cozyHighlightTypes as CozyHighlightType[]);

      return articles.map(article => ({
        ...article,
        type: article.typeId ? types.find(type => type.id === article.typeId)?.name || article.type : article.type
      }));
    },

    /**
     * Get paginated enriched articles
     */
    getPaginatedEnrichedArticles: async (options?: PaginationOptions): Promise<PaginatedResponse<CozyArticle>> => {
      const enrichedArticles = await this.getEnrichedArticles();
      return paginateData(enrichedArticles, options);
    }
  };
}
