import { dbAsync } from '../../db/config.js';
import { removeIdFromEntries } from './diaryUtils.js';

// Get diary categories
export const getDiaryCategories = async (req, res) => {
  try {
    const categories = await dbAsync.all('SELECT * FROM diary_categories ORDER BY name');
    res.json(categories);
  } catch (error) {
    console.error('Error fetching diary categories:', error);
    res.status(500).json({error: 'Failed to fetch diary categories'});
  }
};

// Get diary category by ID
export const getDiaryCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await dbAsync.get('SELECT * FROM diary_categories WHERE id = ?', [id]);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    console.error(`Error fetching diary category ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch diary category' });
  }
};

// Create diary category
export const createDiaryCategory = async (req, res) => {
  try {
    const { name, image } = req.body;
    const id = `category-diary-${Date.now()}`;
    
    await dbAsync.run(
      'INSERT INTO diary_categories (id, name, image) VALUES (?, ?, ?)',
      [id, name, image || null]
    );
    
    const newCategory = await dbAsync.get('SELECT * FROM diary_categories WHERE id = ?', [id]);
    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error creating diary category:', error);
    res.status(500).json({ error: 'Failed to create diary category' });
  }
};

// Update diary category
export const updateDiaryCategory = async (req, res) => {
  try {
    const { name, image } = req.body;
    const { id } = req.params;
    
    // Check if category exists
    const existingCategory = await dbAsync.get('SELECT * FROM diary_categories WHERE id = ?', [id]);
    if (!existingCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    await dbAsync.run(
      'UPDATE diary_categories SET name = ?, image = ? WHERE id = ?',
      [name, image || null, id]
    );
    
    const updatedCategory = await dbAsync.get('SELECT * FROM diary_categories WHERE id = ?', [id]);
    res.json(updatedCategory);
  } catch (error) {
    console.error(`Error updating diary category ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to update diary category' });
  }
};

// Delete diary category
export const deleteDiaryCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if category exists
    const existingCategory = await dbAsync.get('SELECT * FROM diary_categories WHERE id = ?', [id]);
    if (!existingCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    // First remove this category ID from all entries that use it
    await removeIdFromEntries(id, 'category');
    
    // Then delete the category
    await dbAsync.run('DELETE FROM diary_categories WHERE id = ?', [id]);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error(`Error deleting diary category ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to delete diary category' });
  }
};
