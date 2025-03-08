
import { dbAsync } from '../db/config.js';

// Get all diary entries
export const getAllEntries = async (req, res) => {
  try {
    // Get all entries
    const entries = await dbAsync.all(`
      SELECT e.*, c.name as categoryName, m.name as moodName
      FROM diary_entries e
      LEFT JOIN diary_categories c ON e.categoryId = c.id
      LEFT JOIN diary_moods m ON e.moodId = m.id
    `);
    
    // For each entry, get its tags
    const entriesWithTags = await Promise.all(entries.map(async (entry) => {
      // Get tags
      const tagsRows = await dbAsync.all(`
        SELECT t.id, t.name 
        FROM diary_tags t
        JOIN diary_tag_map m ON t.id = m.tagId
        WHERE m.diaryId = ?
      `, [entry.id]);
      
      // Transform to match expected format
      return {
        ...entry,
        tags: tagsRows.map(t => t.name),
        tagIds: tagsRows.map(t => t.id)
      };
    }));
    
    res.json(entriesWithTags);
  } catch (error) {
    console.error('Error fetching diary entries:', error);
    res.status(500).json({ error: 'Failed to fetch diary entries' });
  }
};

// Get diary entry by ID
export const getEntryById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get entry with category and mood name
    const entry = await dbAsync.get(`
      SELECT e.*, c.name as categoryName, m.name as moodName
      FROM diary_entries e
      LEFT JOIN diary_categories c ON e.categoryId = c.id
      LEFT JOIN diary_moods m ON e.moodId = m.id
      WHERE e.id = ?
    `, [id]);
    
    if (!entry) {
      return res.status(404).json({ error: 'Diary entry not found' });
    }
    
    // Get tags
    const tagsRows = await dbAsync.all(`
      SELECT t.id, t.name 
      FROM diary_tags t
      JOIN diary_tag_map m ON t.id = m.tagId
      WHERE m.diaryId = ?
    `, [entry.id]);
    
    // Add tags to entry
    entry.tags = tagsRows.map(t => t.name);
    entry.tagIds = tagsRows.map(t => t.id);
    
    res.json(entry);
  } catch (error) {
    console.error(`Error fetching diary entry ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch diary entry' });
  }
};

// Get diary categories
export const getCategories = async (req, res) => {
  try {
    const categories = await dbAsync.all('SELECT * FROM diary_categories');
    res.json(categories);
  } catch (error) {
    console.error('Error fetching diary categories:', error);
    res.status(500).json({ error: 'Failed to fetch diary categories' });
  }
};

// Get diary moods
export const getMoods = async (req, res) => {
  try {
    const moods = await dbAsync.all('SELECT * FROM diary_moods');
    res.json(moods);
  } catch (error) {
    console.error('Error fetching diary moods:', error);
    res.status(500).json({ error: 'Failed to fetch diary moods' });
  }
};

// Get diary tags
export const getTags = async (req, res) => {
  try {
    const tags = await dbAsync.all('SELECT * FROM diary_tags');
    res.json(tags);
  } catch (error) {
    console.error('Error fetching diary tags:', error);
    res.status(500).json({ error: 'Failed to fetch diary tags' });
  }
};

// Get tags by IDs
export const getTagsByIds = async (req, res) => {
  try {
    const { ids } = req.query;
    
    if (!ids) {
      return res.status(400).json({ error: 'IDs parameter is required' });
    }
    
    const idArray = ids.split(',');
    const placeholders = idArray.map(() => '?').join(',');
    
    const tags = await dbAsync.all(
      `SELECT * FROM diary_tags WHERE id IN (${placeholders})`, 
      idArray
    );
    
    res.json(tags);
  } catch (error) {
    console.error('Error fetching diary tags by IDs:', error);
    res.status(500).json({ error: 'Failed to fetch diary tags' });
  }
};
