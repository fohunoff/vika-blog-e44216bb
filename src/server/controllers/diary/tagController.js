
import { dbAsync } from '../../db/config.js';

// Get diary tags
export const getDiaryTags = async (req, res) => {
  try {
    const tags = await dbAsync.all('SELECT * FROM diary_tags ORDER BY name');
    res.json(tags);
  } catch (error) {
    console.error('Error fetching diary tags:', error);
    res.status(500).json({error: 'Failed to fetch diary tags'});
  }
};

// Get diary tag by ID
export const getDiaryTagById = async (req, res) => {
  try {
    const { id } = req.params;
    const tag = await dbAsync.get('SELECT * FROM diary_tags WHERE id = ?', [id]);

    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    res.json(tag);
  } catch (error) {
    console.error(`Error fetching diary tag ${req.params.id}:`, error);
    res.status(500).json({error: 'Failed to fetch diary tag'});
  }
};

// Get diary tags by IDs
export const getDiaryTagsByIds = async (req, res) => {
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

// Create diary tag
export const createDiaryTag = async (req, res) => {
  try {
    const { name } = req.body;
    const id = `tag-diary-${Date.now()}`;
    
    await dbAsync.run(
      'INSERT INTO diary_tags (id, name) VALUES (?, ?)',
      [id, name]
    );
    
    const newTag = await dbAsync.get('SELECT * FROM diary_tags WHERE id = ?', [id]);
    res.status(201).json(newTag);
  } catch (error) {
    console.error('Error creating diary tag:', error);
    res.status(500).json({ error: 'Failed to create diary tag' });
  }
};

// Update diary tag
export const updateDiaryTag = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    
    // Check if tag exists
    const existingTag = await dbAsync.get('SELECT * FROM diary_tags WHERE id = ?', [id]);
    if (!existingTag) {
      return res.status(404).json({ error: 'Tag not found' });
    }
    
    await dbAsync.run(
      'UPDATE diary_tags SET name = ? WHERE id = ?',
      [name, id]
    );
    
    const updatedTag = await dbAsync.get('SELECT * FROM diary_tags WHERE id = ?', [id]);
    res.json(updatedTag);
  } catch (error) {
    console.error(`Error updating diary tag ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to update diary tag' });
  }
};

// Delete diary tag
export const deleteDiaryTag = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if tag exists
    const existingTag = await dbAsync.get('SELECT * FROM diary_tags WHERE id = ?', [id]);
    if (!existingTag) {
      return res.status(404).json({ error: 'Tag not found' });
    }
    
    await dbAsync.run('DELETE FROM diary_tags WHERE id = ?', [id]);
    res.json({ message: 'Tag deleted successfully' });
  } catch (error) {
    console.error(`Error deleting diary tag ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to delete diary tag' });
  }
};
