
import { dbAsync } from '../../db/config.js';

// Get diary moods
export const getDiaryMoods = async (req, res) => {
  try {
    const moods = await dbAsync.all('SELECT * FROM diary_moods ORDER BY name');
    res.json(moods);
  } catch (error) {
    console.error('Error fetching diary moods:', error);
    res.status(500).json({error: 'Failed to fetch diary moods'});
  }
};

// Get diary mood by ID
export const getDiaryMoodById = async (req, res) => {
  try {
    const { id } = req.params;
    const mood = await dbAsync.get('SELECT * FROM diary_moods WHERE id = ?', [id]);

    if (!mood) {
      return res.status(404).json({ error: 'Mood not found' });
    }

    res.json(mood);
  } catch (error) {
    console.error(`Error fetching diary mood ${req.params.id}:`, error);
    res.status(500).json({error: 'Failed to fetch diary mood'});
  }
};

// Create diary mood
export const createDiaryMood = async (req, res) => {
  try {
    const { name, icon } = req.body;
    const id = `mood-${Date.now()}`;
    
    await dbAsync.run(
      'INSERT INTO diary_moods (id, name, icon) VALUES (?, ?, ?)',
      [id, name, icon || null]
    );
    
    const newMood = await dbAsync.get('SELECT * FROM diary_moods WHERE id = ?', [id]);
    res.status(201).json(newMood);
  } catch (error) {
    console.error('Error creating diary mood:', error);
    res.status(500).json({ error: 'Failed to create diary mood' });
  }
};

// Update diary mood
export const updateDiaryMood = async (req, res) => {
  try {
    const { name, icon } = req.body;
    const { id } = req.params;
    
    // Check if mood exists
    const existingMood = await dbAsync.get('SELECT * FROM diary_moods WHERE id = ?', [id]);
    if (!existingMood) {
      return res.status(404).json({ error: 'Mood not found' });
    }
    
    await dbAsync.run(
      'UPDATE diary_moods SET name = ?, icon = ? WHERE id = ?',
      [name, icon || null, id]
    );
    
    const updatedMood = await dbAsync.get('SELECT * FROM diary_moods WHERE id = ?', [id]);
    res.json(updatedMood);
  } catch (error) {
    console.error(`Error updating diary mood ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to update diary mood' });
  }
};

// Delete diary mood
export const deleteDiaryMood = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if mood exists
    const existingMood = await dbAsync.get('SELECT * FROM diary_moods WHERE id = ?', [id]);
    if (!existingMood) {
      return res.status(404).json({ error: 'Mood not found' });
    }
    
    await dbAsync.run('DELETE FROM diary_moods WHERE id = ?', [id]);
    res.json({ message: 'Mood deleted successfully' });
  } catch (error) {
    console.error(`Error deleting diary mood ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to delete diary mood' });
  }
};
