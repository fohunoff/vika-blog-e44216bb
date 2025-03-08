
import { dbAsync } from '../db/config.js';

// Get all cozy articles
export const getAllArticles = async (req, res) => {
  try {
    // Get all articles
    const articles = await dbAsync.all(`
      SELECT a.*, c.name as categoryName, t.name as typeName
      FROM cozy_articles a
      LEFT JOIN cozy_categories c ON a.categoryId = c.id
      LEFT JOIN cozy_highlight_types t ON a.typeId = t.id
    `);
    
    // For each article, get its tags
    const articlesWithTags = await Promise.all(articles.map(async (article) => {
      // Get tags
      const tagsRows = await dbAsync.all(`
        SELECT t.id, t.name 
        FROM cozy_tags t
        JOIN cozy_tag_map m ON t.id = m.tagId
        WHERE m.articleId = ?
      `, [article.id]);
      
      // Transform to match expected format
      return {
        ...article,
        id: article.id,
        title: article.title,
        content: article.content,
        image: article.imageSrc,
        date: article.publishDate,
        category: article.categoryName,
        tags: tagsRows.map(t => t.name),
        isHighlight: Boolean(article.isHighlight),
        typeId: article.typeId,
        type: article.typeName
      };
    }));
    
    res.json(articlesWithTags);
  } catch (error) {
    console.error('Error fetching cozy articles:', error);
    res.status(500).json({ error: 'Failed to fetch cozy articles' });
  }
};

// Get highlighted articles
export const getHighlights = async (req, res) => {
  try {
    // Get highlighted articles
    const highlights = await dbAsync.all(`
      SELECT a.*, c.name as categoryName, t.name as typeName
      FROM cozy_articles a
      LEFT JOIN cozy_categories c ON a.categoryId = c.id
      LEFT JOIN cozy_highlight_types t ON a.typeId = t.id
      WHERE a.isHighlight = 1
    `);
    
    // For each highlight, get its tags
    const highlightsWithTags = await Promise.all(highlights.map(async (highlight) => {
      // Get tags
      const tagsRows = await dbAsync.all(`
        SELECT t.id, t.name 
        FROM cozy_tags t
        JOIN cozy_tag_map m ON t.id = m.tagId
        WHERE m.articleId = ?
      `, [highlight.id]);
      
      // Transform to match expected format
      return {
        ...highlight,
        id: highlight.id,
        title: highlight.title,
        content: highlight.content,
        image: highlight.imageSrc,
        date: highlight.publishDate,
        category: highlight.categoryName,
        tags: tagsRows.map(t => t.name),
        isHighlight: Boolean(highlight.isHighlight),
        typeId: highlight.typeId,
        type: highlight.typeName
      };
    }));
    
    res.json(highlightsWithTags);
  } catch (error) {
    console.error('Error fetching cozy highlights:', error);
    res.status(500).json({ error: 'Failed to fetch cozy highlights' });
  }
};

// Get article by ID
export const getArticleById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get article with category and type name
    const article = await dbAsync.get(`
      SELECT a.*, c.name as categoryName, t.name as typeName
      FROM cozy_articles a
      LEFT JOIN cozy_categories c ON a.categoryId = c.id
      LEFT JOIN cozy_highlight_types t ON a.typeId = t.id
      WHERE a.id = ?
    `, [id]);
    
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    // Get tags
    const tagsRows = await dbAsync.all(`
      SELECT t.id, t.name 
      FROM cozy_tags t
      JOIN cozy_tag_map m ON t.id = m.tagId
      WHERE m.articleId = ?
    `, [article.id]);
    
    // Transform to match expected format
    const transformedArticle = {
      ...article,
      id: article.id,
      title: article.title,
      content: article.content,
      image: article.imageSrc,
      date: article.publishDate,
      category: article.categoryName,
      tags: tagsRows.map(t => t.name),
      isHighlight: Boolean(article.isHighlight),
      typeId: article.typeId,
      type: article.typeName
    };
    
    res.json(transformedArticle);
  } catch (error) {
    console.error(`Error fetching article ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch article' });
  }
};

// Get cozy categories
export const getCategories = async (req, res) => {
  try {
    const categories = await dbAsync.all('SELECT * FROM cozy_categories');
    res.json(categories);
  } catch (error) {
    console.error('Error fetching cozy categories:', error);
    res.status(500).json({ error: 'Failed to fetch cozy categories' });
  }
};

// Get highlight types
export const getHighlightTypes = async (req, res) => {
  try {
    const types = await dbAsync.all('SELECT * FROM cozy_highlight_types');
    res.json(types);
  } catch (error) {
    console.error('Error fetching highlight types:', error);
    res.status(500).json({ error: 'Failed to fetch highlight types' });
  }
};

// Get cozy tags
export const getTags = async (req, res) => {
  try {
    const tags = await dbAsync.all('SELECT * FROM cozy_tags');
    res.json(tags);
  } catch (error) {
    console.error('Error fetching cozy tags:', error);
    res.status(500).json({ error: 'Failed to fetch cozy tags' });
  }
};
