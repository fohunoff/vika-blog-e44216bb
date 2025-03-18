
import { db, dbAsync } from '../../db/config.js';
import { v4 as uuidv4 } from 'uuid';
import { validateIds, filterValidIds } from './diaryUtils.js';

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
