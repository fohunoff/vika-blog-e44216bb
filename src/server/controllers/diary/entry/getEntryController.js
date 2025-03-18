
import { dbAsync } from '../../../db/config.js';

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
