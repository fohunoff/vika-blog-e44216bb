import { dbAsync } from '../db/config.js';

// Get all main navigation categories
export const getMainCategories = async (req, res) => {
    try {
        const categories = await dbAsync.all('SELECT * FROM main_categories');
        res.json(categories);
    } catch (error) {
        console.error('Error fetching main categories:', error);
        res.status(500).json({ error: 'Failed to fetch main categories' });
    }
};

// Get a single main category by ID
export const getMainCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await dbAsync.get('SELECT * FROM main_categories WHERE id = ?', [id]);

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.json(category);
    } catch (error) {
        console.error(`Error fetching main category ${req.params.id}:`, error);
        res.status(500).json({ error: 'Failed to fetch main category' });
    }
};

// Get all featured sections
export const getFeaturedSections = async (req, res) => {
    try {
        const sections = await dbAsync.all('SELECT * FROM main_featured_sections');
        res.json(sections);
    } catch (error) {
        console.error('Error fetching featured sections:', error);
        res.status(500).json({ error: 'Failed to fetch featured sections' });
    }
};

// Get a single featured section by ID
export const getFeaturedSectionById = async (req, res) => {
    try {
        const { id } = req.params;
        const section = await dbAsync.get('SELECT * FROM main_featured_sections WHERE id = ?', [id]);

        if (!section) {
            return res.status(404).json({ error: 'Featured section not found' });
        }

        res.json(section);
    } catch (error) {
        console.error(`Error fetching featured section ${req.params.id}:`, error);
        res.status(500).json({ error: 'Failed to fetch featured section' });
    }
};

// Get all latest posts
export const getLatestPosts = async (req, res) => {
    try {
        const posts = await dbAsync.all('SELECT * FROM main_latest_posts ORDER BY date DESC');
        res.json(posts);
    } catch (error) {
        console.error('Error fetching latest posts:', error);
        res.status(500).json({ error: 'Failed to fetch latest posts' });
    }
};

// Get hero data
export const getHeroData = async (req, res) => {
    try {
        const heroData = await dbAsync.get('SELECT * FROM main_hero_data WHERE id = ?', ['default']);

        if (!heroData) {
            return res.status(404).json({ error: 'Hero data not found' });
        }

        // Transform the data to match the expected format
        const transformedData = {
            tagline: heroData.tagline,
            title: heroData.title,
            description: heroData.description,
            primaryButton: {
                text: heroData.primaryButtonText,
                link: heroData.primaryButtonLink
            },
            secondaryButton: {
                text: heroData.secondaryButtonText,
                link: heroData.secondaryButtonLink
            },
            mainImage: {
                src: heroData.mainImageSrc,
                alt: heroData.mainImageAlt
            },
            badge: {
                text: heroData.badgeText
            },
            imageCaption: {
                title: heroData.imageCaptionTitle,
                subtitle: heroData.imageCaptionSubtitle
            }
        };

        res.json(transformedData);
    } catch (error) {
        console.error('Error fetching hero data:', error);
        res.status(500).json({ error: 'Failed to fetch hero data' });
    }
};

// Get about data
export const getAboutData = async (req, res) => {
    try {
        const aboutData = await dbAsync.get('SELECT * FROM main_about_data WHERE id = ?', ['default']);

        if (!aboutData) {
            return res.status(404).json({ error: 'About data not found' });
        }

        // Parse the paragraphs JSON string
        const transformedData = {
            ...aboutData,
            paragraphs: JSON.parse(aboutData.paragraphs)
        };

        res.json(transformedData);
    } catch (error) {
        console.error('Error fetching about data:', error);
        res.status(500).json({ error: 'Failed to fetch about data' });
    }
};

// Get newsletter data
export const getNewsletterData = async (req, res) => {
    try {
        const newsletterData = await dbAsync.get('SELECT * FROM main_newsletter_data WHERE id = ?', ['default']);

        if (!newsletterData) {
            return res.status(404).json({ error: 'Newsletter data not found' });
        }

        res.json(newsletterData);
    } catch (error) {
        console.error('Error fetching newsletter data:', error);
        res.status(500).json({ error: 'Failed to fetch newsletter data' });
    }
};
