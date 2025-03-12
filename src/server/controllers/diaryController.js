
import { db, dbAsync } from '../db/config.js';
import { v4 as uuidv4 } from 'uuid';

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

  try {
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

  const updatedEntry = {
    id,
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
    UPDATE diary_entries 
    SET title = ?, content = ?, shortDescription = ?, imageSrc = ?,
        categoryId = ?, categoryIds = ?, tagIds = ?, moodId = ?, moodIds = ?,
        updatedAt = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  try {
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

// Get diary categories
export const getDiaryCategories = async (req, res) => {
  try {
    const categories = await dbAsync.all('SELECT * FROM diary_categories');
    res.json(categories);
  } catch (error) {
    console.error('Error fetching diary categories:', error);
    res.status(500).json({error: 'Failed to fetch diary categories'});
  }
}

// Get diary category by ID
export const getDiaryCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await dbAsync.get('SELECT * FROM diary_categories WHERE id = ?', [id]);

    if (!category) {
      return res.status(404).json({ error: 'Diary category not found' });
    }

    res.json(category);
  } catch (error) {
    console.error(`Error fetching diary category ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch diary category' });
  }
};

// Get diary tags
export const getDiaryTags = async (req, res) => {
  try {
    const tags = await dbAsync.all('SELECT * FROM diary_tags');
    res.json(tags);
  } catch (error) {
    console.error('Error fetching diary tags:', error);
    res.status(500).json({error: 'Failed to fetch diary tags'});
  }
}

// Get diary tag by ID
export const getDiaryTagById = async (req, res) => {
  try {
    const { id } = req.params;
    const tag = await dbAsync.get('SELECT * FROM diary_tags WHERE id = ?', [id]);

    if (!tag) {
      return res.status(404).json({ error: 'Diary tag not found' });
    }

    res.json(tag);
  } catch (error) {
    console.error(`Error fetching diary tag ${req.params.id}:`, error);
    res.status(500).json({error: 'Failed to fetch diary tag'});
  }
}

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

// Get diary moods
export const getDiaryMoods = async (req, res) => {
  try {
    const moods = await dbAsync.all('SELECT * FROM diary_moods');
    res.json(moods);
  } catch (error) {
    console.error('Error fetching diary moods:', error);
    res.status(500).json({error: 'Failed to fetch diary moods'});
  }
}

// Get diary mood by ID
export const getDiaryMoodById = async (req, res) => {
  try {
    const {id} = req.params;
    const mood = await dbAsync.get('SELECT * FROM diary_moods WHERE id = ?', [id]);

    if (!mood) {
      return res.status(404).json({error: 'Diary mood not found'});
    }

    res.json(mood);
  } catch (error) {
    console.error(`Error fetching diary mood ${req.params.id}:`, error);
    res.status(500).json({error: 'Failed to fetch diary mood'});
  }
}
