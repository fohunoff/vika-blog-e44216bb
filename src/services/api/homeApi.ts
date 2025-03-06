import homeArticles from '../../data/home/home-articles.json';
import homeCategories from '../../data/home/home-categories.json';
import homeTags from '../../data/home/home-tags.json';
import highlightTypes from '../../data/home/highlights-types.json';
import featuredSections from '../../data/home/featured-sections.json';
import categories from '../../data/home/categories.json';
import latestPosts from '../../data/home/latest-posts.json';
import aboutData from '../../data/home/about.json';
import heroData from '../../data/home/hero.json';
import newsletterData from '../../data/home/newsletter.json';
import { getData, getById, getByIds, enrichWithRelated } from './utils';
import { HomeCategory, HomeHighlight, HomeHighlightType, HomeTag, HomeArticle, HomeFeaturedSection } from '../../types/models';

interface Category {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  link: string;
  bgColor: 'black' | 'white' | 'yellow';
}

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
     * Get all featured sections
     */
    getFeaturedSections: (): Promise<HomeFeaturedSection[]> => {
      return getData(featuredSections as HomeFeaturedSection[]);
    },
    
    /**
     * Get a single featured section by ID
     */
    getFeaturedSectionById: (id: string): Promise<HomeFeaturedSection | undefined> => {
      return getById(featuredSections as HomeFeaturedSection[], id);
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
    },

    /**
     * Get category sections for index page
     */
    getIndexCategories: (): Promise<Category[]> => {
      return getData(categories as Category[]);
    },

    /**
     * Get latest posts for index page
     */
    getLatestPosts: (): Promise<any[]> => {
      return getData(latestPosts);
    },

    /**
     * Get about section data
     */
    getAboutData: (): Promise<any> => {
      return getData(aboutData);
    },

    /**
     * Get hero section data
     */
    getHeroData: (): Promise<any> => {
      return getData(heroData);
    },

    /**
     * Get newsletter section data
     */
    getNewsletterData: (): Promise<any> => {
      return getData(newsletterData);
    }
  };
}
