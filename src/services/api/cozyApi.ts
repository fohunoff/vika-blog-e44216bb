import cozyArticles from '../../data/cozy.json';
import cozyCategories from '../../data/cozy/cozy-categories.json';
import cozyTags from '../../data/cozy/cozy-tags.json';
import cozyHighlightTypes from '../../data/cozy/cozy-highlights-types.json';

import { getData, getById, getByIds, retryPromise } from './utils';
import { CozyCategory, CozyHighlightType, CozyTag, CozyArticle } from '../../types/models';

/**
 * Base URL for API requests
 */
const API_BASE_URL = 'http://localhost:3001';

export function createCozyApi() {
  return {
    /**
     * Get all cozy articles
     */
    getArticles: async (): Promise<CozyArticle[]> => {
      // Try to get data from API first
      try {
        const response = await fetch(`${API_BASE_URL}/cozy/articles`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
      } catch (error) {
        console.warn('API request failed, falling back to local data:', error);
        // Fallback to local data
        return retryPromise(() => getData(cozyArticles as CozyArticle[]));
      }
    },

    /**
     * Get highlighted articles (for the Highlights section)
     */
    getHighlights: async (): Promise<CozyArticle[]> => {
      // Try to get data from API first
      try {
        const response = await fetch(`${API_BASE_URL}/cozy/highlights`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
      } catch (error) {
        console.warn('API request failed, falling back to local data:', error);
        // Fallback to local data
        return retryPromise(() => getData((cozyArticles as CozyArticle[]).filter(article => article.isHighlight)));
      }
    },

    /**
     * Get a single article by ID
     */
    getArticleById: async (id: string): Promise<CozyArticle | undefined> => {
      // Try to get data from API first
      try {
        const response = await fetch(`${API_BASE_URL}/cozy/articles/${id}`);
        if (response.status === 404) return undefined;
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
      } catch (error) {
        console.warn('API request failed, falling back to local data:', error);
        // Fallback to local data
        return retryPromise(() => getById(cozyArticles as CozyArticle[], id));
      }
    },

    /**
     * Get all highlight types
     */
    getHighlightTypes: async (): Promise<CozyHighlightType[]> => {
      // Try to get data from API first
      try {
        const response = await fetch(`${API_BASE_URL}/cozy/highlight-types`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
      } catch (error) {
        console.warn('API request failed, falling back to local data:', error);
        // Fallback to local data
        return retryPromise(() => getData(cozyHighlightTypes as CozyHighlightType[]));
      }
    },

    /**
     * Get all cozy categories
     */
    getCategories: async (): Promise<CozyCategory[]> => {
      // Try to get data from API first
      try {
        const response = await fetch(`${API_BASE_URL}/cozy/categories`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
      } catch (error) {
        console.warn('API request failed, falling back to local data:', error);
        // Fallback to local data
        return retryPromise(() => getData(cozyCategories as CozyCategory[]));
      }
    },

    /**
     * Get all cozy tags
     */
    getTags: async (): Promise<CozyTag[]> => {
      // Try to get data from API first
      try {
        const response = await fetch(`${API_BASE_URL}/cozy/tags`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
      } catch (error) {
        console.warn('API request failed, falling back to local data:', error);
        // Fallback to local data
        return retryPromise(() => getData(cozyTags as CozyTag[]));
      }
    },

    /**
     * Get a single cozy tag by ID
     */
    getTagById: async (id: string): Promise<CozyTag | undefined> => {
      // Try to get data from API first
      try {
        const response = await fetch(`${API_BASE_URL}/cozy/tags/${id}`);
        if (response.status === 404) return undefined;
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
      } catch (error) {
        console.warn('API request failed, falling back to local data:', error);
        // Fallback to local data
        return retryPromise(() => getById(cozyTags as CozyTag[], id));
      }
    },

    /**
     * Get cozy tags by IDs
     */
    getTagsByIds: async (ids: string[]): Promise<CozyTag[]> => {
      // Try to get data from API first
      try {
        const params = new URLSearchParams({ ids: ids.join(',') });
        const response = await fetch(`${API_BASE_URL}/cozy/tags/multiple?${params}`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
      } catch (error) {
        console.warn('API request failed, falling back to local data:', error);
        // Fallback to local data
        return retryPromise(() => getByIds(cozyTags as CozyTag[], ids));
      }
    },

    /**
     * Get enriched articles with type information
     */
    getEnrichedArticles: async (): Promise<CozyArticle[]> => {
      // Try using already enriched data from getArticles (which will try API first)
      try {
        const articles = await this.getArticles();

        // If articles don't have type info, fetch types and enrich them
        if (articles.some(article => article.typeId && !article.type)) {
          const types = await this.getHighlightTypes();

          return articles.map(article => ({
            ...article,
            type: article.typeId ? types.find(type => type.id === article.typeId)?.name || article.type : article.type
          }));
        }

        return articles;
      } catch (error) {
        console.warn('Failed to get enriched articles:', error);

        // Manual fallback if needed
        return retryPromise(async () => {
          const articles = await getData(cozyArticles as CozyArticle[]);
          const types = await getData(cozyHighlightTypes as CozyHighlightType[]);

          return articles.map(article => ({
            ...article,
            type: article.typeId ? types.find(type => type.id === article.typeId)?.name || article.type : article.type
          }));
        });
      }
    }
  };
}
