
import { db, dbAsync } from '../db/config.js';
import { v4 as uuidv4 } from 'uuid';

// Utility function to validate IDs against existing records
async function validateIds(typeTable, ids) {
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return { valid: true, invalidIds: [] };
  }

  try {
    // Get all valid IDs from the database
    const validRecords = await dbAsync.all(`SELECT id FROM ${typeTable}`);
    const validIds = validRecords.map(record => record.id);
    
    // Check which IDs from the request are invalid
    const invalidIds = ids.filter(id => !validIds.includes(id));
    
    return {
      valid: invalidIds.length === 0,
      invalidIds
    };
  } catch (error) {
    console.error(`Error validating IDs against ${typeTable}:`, error);
    throw new Error(`Failed to validate IDs against ${typeTable}`);
  }
}

// Utility function to filter invalid IDs from an array
async function filterValidIds(typeTable, ids) {
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return [];
  }

  try {
    // Get all valid IDs from the database
    const validRecords = await dbAsync.all(`SELECT id FROM ${typeTable}`);
    const validIds = validRecords.map(record => record.id);
    
    // Filter out invalid IDs
    return ids.filter(id => validIds.includes(id));
  } catch (error) {
    console.error(`Error filtering IDs against ${typeTable}:`, error);
    throw new Error(`Failed to filter IDs against ${typeTable}`);
  }
}

// GET all diary entries
export const getDiaryEntries = async (req, res) => {
  try {
    const rows = await dbAsync.all("SELECT * FROM diary_entries");
    return res.json(rows);
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json({ error: "Failed to fetch diary entries" });
  }
};

// GET a specific diary entry by ID
export const getDiaryEntryById = async (req, res) => {
  const { id } = req.params;

  try {
    const row = await dbAsync.get("SELECT * FROM diary_entries WHERE id = ?", [id]);

    if (!row) {
      return res.status(404).json({ error: `Diary entry with id ${id} not found` });
    }

    return res.json(row);
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json({ error: "Failed to fetch diary entry" });
  }
};

// GET enriched diary entries
export const getEnrichedDiaryEntries = async (req, res) => {
  try {
    const entries = await dbAsync.all("SELECT * FROM diary_entries");

    // Get categories, tags, and moods from database
    const [categories, tags, moods] = await Promise.all([
      dbAsync.all("SELECT * FROM diary_categories"),
      dbAsync.all("SELECT * FROM diary_tags"),
      dbAsync.all("SELECT * FROM diary_moods")
    ]);

    const enrichedEntries = entries.map(entry => {
      const category = categories.find(c => c.id === entry.categoryIds[0]);

      const entryTags = entry.tagIds
        ? JSON.parse(entry.tagIds).map(id => tags.find(t => t.id === id)).filter(Boolean)
        : [];

      const mood = moods.find(m => m.id === entry.moodIds[0]);

      return {
        ...entry,
        category: category?.name,
        mood: mood?.name,
        tags: entryTags.map(t => t?.name)
      };
    });

    res.json(enrichedEntries);
  } catch (err) {
    console.error("Error enriching entries:", err);
    res.status(500).json({ error: "Failed to enrich entries" });
  }
};

// CREATE a new diary entry
export const createDiaryEntry = async (req, res) => {
  console.log("Creating diary entry with data:", req.body);
  const {
    title,
    content,
    shortDescription,
    imageSrc,
    categoryIds,
    tagIds,
    moodIds
  } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }

  try {
    // Validate category IDs
    const categoryValidation = await validateIds('diary_categories', categoryIds);
    if (!categoryValidation.valid) {
      return res.status(400).json({ 
        error: "Invalid category IDs", 
        invalidIds: categoryValidation.invalidIds 
      });
    }

    // Validate tag IDs
    const tagValidation = await validateIds('diary_tags', tagIds);
    if (!tagValidation.valid) {
      return res.status(400).json({ 
        error: "Invalid tag IDs", 
        invalidIds: tagValidation.invalidIds 
      });
    }

    // Validate mood IDs
    const moodValidation = await validateIds('diary_moods', moodIds);
    if (!moodValidation.valid) {
      return res.status(400).json({ 
        error: "Invalid mood IDs", 
        invalidIds: moodValidation.invalidIds 
      });
    }

    const newEntry = {
      id: `diary-entry-${uuidv4()}`,
      title,
      content,
      shortDescription: shortDescription || "",
      imageSrc: imageSrc || "",
      categoryId: categoryIds && categoryIds.length > 0 ? categoryIds[0] : null,
      categoryIds: JSON.stringify(categoryIds || []),
      tagIds: JSON.stringify(tagIds || []),
      moodId: moodIds && moodIds.length > 0 ? moodIds[0] : null,
      moodIds: JSON.stringify(moodIds || [])
    };

    const sql = `
      INSERT INTO diary_entries (
        id, title, content, shortDescription, imageSrc,
        categoryId, categoryIds, tagIds, moodId, moodIds
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await dbAsync.run(
        sql,
        [
          newEntry.id,
          newEntry.title,
          newEntry.content,
          newEntry.shortDescription,
          newEntry.imageSrc,
          newEntry.categoryId,
          newEntry.categoryIds,
          newEntry.tagIds,
          newEntry.moodId,
          newEntry.moodIds
        ]
    );

    console.log("Created diary entry with ID:", newEntry.id);
    res.status(201).json(newEntry);
  } catch (err) {
    console.error("Error creating diary entry in database:", err);
    return res.status(500).json({ error: "Failed to create diary entry" });
  }
};

// UPDATE a diary entry
export const updateDiaryEntry = async (req, res) => {
  const { id } = req.params;
  console.log(`Updating diary entry with ID: ${id}`, req.body);

  const {
    title,
    content,
    shortDescription,
    imageSrc,
    categoryIds,
    tagIds,
    moodIds
  } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }

  try {
    // First, filter out non-existent IDs from the arrays
    const filteredCategoryIds = await filterValidIds('diary_categories', categoryIds);
    const filteredTagIds = await filterValidIds('diary_tags', tagIds);
    const filteredMoodIds = await filterValidIds('diary_moods', moodIds);

    // Log the filtered IDs for debugging
    console.log("Original category IDs:", categoryIds);
    console.log("Filtered category IDs:", filteredCategoryIds);
    
    console.log("Original tag IDs:", tagIds);
    console.log("Filtered tag IDs:", filteredTagIds);
    
    console.log("Original mood IDs:", moodIds);
    console.log("Filtered mood IDs:", filteredMoodIds);

    // Check if any IDs were filtered out
    const removedCategoryIds = categoryIds?.filter(id => !filteredCategoryIds.includes(id)) || [];
    const removedTagIds = tagIds?.filter(id => !filteredTagIds.includes(id)) || [];
    const removedMoodIds = moodIds?.filter(id => !filteredMoodIds.includes(id)) || [];
    
    if (removedCategoryIds.length > 0 || removedTagIds.length > 0 || removedMoodIds.length > 0) {
      console.log("Some IDs were filtered out because they no longer exist in the database:");
      if (removedCategoryIds.length > 0) console.log("Removed category IDs:", removedCategoryIds);
      if (removedTagIds.length > 0) console.log("Removed tag IDs:", removedTagIds);
      if (removedMoodIds.length > 0) console.log("Removed mood IDs:", removedMoodIds);
    }

    const updatedEntry = {
      id,
      title,
      content,
      shortDescription: shortDescription || "",
      imageSrc: imageSrc || "",
      categoryId: filteredCategoryIds && filteredCategoryIds.length > 0 ? filteredCategoryIds[0] : null,
      categoryIds: JSON.stringify(filteredCategoryIds || []),
      tagIds: JSON.stringify(filteredTagIds || []),
      moodId: filteredMoodIds && filteredMoodIds.length > 0 ? filteredMoodIds[0] : null,
      moodIds: JSON.stringify(filteredMoodIds || [])
    };

    const sql = `
      UPDATE diary_entries 
      SET title = ?, content = ?, shortDescription = ?, imageSrc = ?,
          categoryId = ?, categoryIds = ?, tagIds = ?, moodId = ?, moodIds = ?,
          updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const result = await dbAsync.run(
        sql,
        [
          updatedEntry.title,
          updatedEntry.content,
          updatedEntry.shortDescription,
          updatedEntry.imageSrc,
          updatedEntry.categoryId,
          updatedEntry.categoryIds,
          updatedEntry.tagIds,
          updatedEntry.moodId,
          updatedEntry.moodIds,
          id
        ]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: `Diary entry with id ${id} not found` });
    }

    console.log("Entry updated:", id);
    res.json(updatedEntry);
  } catch (err) {
    console.error("Error updating entry:", err);
    return res.status(500).json({ error: "Failed to update entry" });
  }
};

// DELETE a diary entry
export const deleteDiaryEntry = async (req, res) => {
  const { id } = req.params;
  console.log(`Deleting diary entry with ID: ${id}`);

  try {
    const result = await dbAsync.run("DELETE FROM diary_entries WHERE id = ?", [id]);

    if (result.changes === 0) {
      return res.status(404).json({ error: `Diary entry with id ${id} not found` });
    }

    res.status(204).send();
  } catch (err) {
    console.error("Error deleting entry:", err);
    return res.status(500).json({ error: "Failed to delete entry" });
  }
};

// CATEGORY CONTROLLERS
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
    
    await dbAsync.run('DELETE FROM diary_categories WHERE id = ?', [id]);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error(`Error deleting diary category ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to delete diary category' });
  }
};

// TAG CONTROLLERS
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

// MOOD CONTROLLERS
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
