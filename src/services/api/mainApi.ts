import aboutData from '../../data/main/about.json';
import navigationCategories from '../../data/main/navigation-categories.json';
import featuredSections from '../../data/main/featured-sections.json';
import heroData from '../../data/main/hero.json';
import latestPosts from '../../data/main/latest-posts.json';
import newsletterData from '../../data/main/newsletter.json';

import { getData, getById, retryPromise } from './utils';
import { MainFeaturedSection } from "@/types/main";

/**
 * Base URL for API requests
 */
const API_BASE_URL = 'http://localhost:3001';

export interface Category {
    id: string;
    title: string;
    navTitle: string;
    description: string;
    pageDescription?: string;
    imageSrc: string;
    link: string;
    bgColor: 'black' | 'white' | 'yellow';
}

export function createMainApi() {
    return {
        /**
         * Get all featured sections
         */
        getFeaturedSections: async (): Promise<MainFeaturedSection[]> => {
            // Try to get data from API first
            try {
                const response = await fetch(`${API_BASE_URL}/main/featured-sections`);
                if (!response.ok) throw new Error('Network response was not ok');
                return await response.json();
            } catch (error) {
                console.warn('API request failed, falling back to local data:', error);
                // Fallback to local data
                return retryPromise(() => getData(featuredSections as MainFeaturedSection[]));
            }
        },

        /**
         * Get a single featured section by ID
         */
        getFeaturedSectionById: async (id: string): Promise<MainFeaturedSection | undefined> => {
            // Try to get data from API first
            try {
                const response = await fetch(`${API_BASE_URL}/main/featured-sections/${id}`);
                if (response.status === 404) return undefined;
                if (!response.ok) throw new Error('Network response was not ok');
                return await response.json();
            } catch (error) {
                console.warn('API request failed, falling back to local data:', error);
                // Fallback to local data
                return retryPromise(() => getById(featuredSections as MainFeaturedSection[], id));
            }
        },

        /**
         * Get category sections for index page
         */
        getIndexCategories: async (): Promise<Category[]> => {
            // Try to get data from API first
            try {
                const response = await fetch(`${API_BASE_URL}/main/categories`);
                if (!response.ok) throw new Error('Network response was not ok');
                return await response.json();
            } catch (error) {
                console.warn('API request failed, falling back to local data:', error);
                // Fallback to local data
                return retryPromise(() => getData(navigationCategories as Category[]));
            }
        },

        /**
         * Get latest posts for index page
         */
        getLatestPosts: async (): Promise<any[]> => {
            // Try to get data from API first
            try {
                const response = await fetch(`${API_BASE_URL}/main/latest-posts`);
                if (!response.ok) throw new Error('Network response was not ok');
                return await response.json();
            } catch (error) {
                console.warn('API request failed, falling back to local data:', error);
                // Fallback to local data
                return retryPromise(() => getData(latestPosts));
            }
        },

        /**
         * Get about section data
         */
        getAboutData: async (): Promise<any> => {
            // Try to get data from API first
            try {
                const response = await fetch(`${API_BASE_URL}/main/about`);
                if (!response.ok) throw new Error('Network response was not ok');
                return await response.json();
            } catch (error) {
                console.warn('API request failed, falling back to local data:', error);
                // Fallback to local data
                return retryPromise(() => getData(aboutData));
            }
        },

        /**
         * Get hero section data
         */
        getHeroData: async (): Promise<any> => {
            // Try to get data from API first
            try {
                const response = await fetch(`${API_BASE_URL}/main/hero`);
                if (!response.ok) throw new Error('Network response was not ok');
                return await response.json();
            } catch (error) {
                console.warn('API request failed, falling back to local data:', error);
                // Fallback to local data
                return retryPromise(() => getData(heroData));
            }
        },

        /**
         * Get newsletter section data
         */
        getNewsletterData: async (): Promise<any> => {
            // Try to get data from API first
            try {
                const response = await fetch(`${API_BASE_URL}/main/newsletter`);
                if (!response.ok) throw new Error('Network response was not ok');
                return await response.json();
            } catch (error) {
                console.warn('API request failed, falling back to local data:', error);
                // Fallback to local data
                return retryPromise(() => getData(newsletterData));
            }
        }
    }
}
