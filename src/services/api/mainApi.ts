
import aboutData from '../../data/main/about.json';
import navigationCategories from '../../data/main/navigation-categories.json';
import featuredSections from '../../data/main/featured-sections.json';
import heroData from '../../data/main/hero.json';
import latestPosts from '../../data/main/latest-posts.json';
import newsletterData from '../../data/main/newsletter.json';

import { getData, getById, getByIds, enrichWithRelated } from './utils';
import { MainFeaturedSection } from "@/types/models.ts";

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
        getFeaturedSections: (): Promise<MainFeaturedSection[]> => {
            return getData(featuredSections as MainFeaturedSection[]);
        },

        /**
         * Get a single featured section by ID
         */
        getFeaturedSectionById: (id: string): Promise<MainFeaturedSection | undefined> => {
            return getById(featuredSections as MainFeaturedSection[], id);
        },

        /**
         * Get category sections for index page
         */
        getIndexCategories: (): Promise<Category[]> => {
            return getData(navigationCategories as Category[]);
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
    }
}
