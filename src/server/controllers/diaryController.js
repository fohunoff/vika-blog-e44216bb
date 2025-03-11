
import { db } from '../db/config.js';
import { v4 as uuidv4 } from 'uuid';

// GET all diary entries
export const getDiaryEntries = (req, res) => {
  db.all("SELECT * FROM diary_entries", [], (err, rows) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Failed to fetch diary entries" });
    }
    return res.json(rows);
  });
};

// GET a specific diary entry by ID
export const getDiaryEntryById = (req, res) => {
  const { id } = req.params;
  
  db.get("SELECT * FROM diary_entries WHERE id = ?", [id], (err, row) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Failed to fetch diary entry" });
    }
    
    if (!row) {
      return res.status(404).json({ error: `Diary entry with id ${id} not found` });
    }
    
    return res.json(row);
  });
};

// GET enriched diary entries
export const getEnrichedDiaryEntries = (req, res) => {
  db.all("SELECT * FROM diary_entries", [], (err, entries) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Failed to fetch diary entries" });
    }

    // Get categories, tags, and moods from database
    Promise.all([
      new Promise((resolve, reject) => {
        db.all("SELECT * FROM diary_categories", [], (err, categories) => {
          if (err) reject(err);
          else resolve(categories);
        });
      }),
      new Promise((resolve, reject) => {
        db.all("SELECT * FROM diary_tags", [], (err, tags) => {
          if (err) reject(err);
          else resolve(tags);
        });
      }),
      new Promise((resolve, reject) => {
        db.all("SELECT * FROM diary_moods", [], (err, moods) => {
          if (err) reject(err);
          else resolve(moods);
        });
      })
    ]).then(([categories, tags, moods]) => {
      const enrichedEntries = entries.map(entry => {
        const category = categories.find(c => c.id === entry.categoryId);
        const entryTags = entry.tagIds
          ? entry.tagIds.map(id => tags.find(t => t.id === id)).filter(Boolean)
          : [];
        const mood = moods.find(m => m.id === entry.moodId);
        
        return {
          ...entry,
          category: category?.name,
          tags: entryTags.map(t => t?.name),
          mood: mood?.name
        };
      });
      
      res.json(enrichedEntries);
    }).catch(err => {
      console.error("Error enriching entries:", err);
      res.status(500).json({ error: "Failed to enrich entries" });
    });
  });
};

// CREATE a new diary entry
export const createDiaryEntry = (req, res) => {
  console.log("Creating diary entry with data:", req.body);
  const {
    title,
    content,
    shortDescription,
    imageSrc,
    date,
    categoryIds,
    tagIds,
    moodIds
  } = req.body;
  
  if (!title || !content || !date) {
    return res.status(400).json({ error: "Title, content, and date are required" });
  }
  
  const newEntry = {
    id: `diary-entry-${uuidv4()}`,
    title,
    content,
    shortDescription: shortDescription || "",
    imageSrc: imageSrc || "",
    date,
    categoryId: categoryIds && categoryIds.length > 0 ? categoryIds[0] : null,
    categoryIds,
    tagIds: tagIds || [],
    moodId: moodIds && moodIds.length > 0 ? moodIds[0] : null,
    moodIds
  };
  
  const sql = `
    INSERT INTO diary_entries (
      id, title, content, shortDescription, imageSrc, date, 
      categoryId, categoryIds, tagIds, moodId, moodIds
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.run(
    sql,
    [
      newEntry.id,
      newEntry.title,
      newEntry.content,
      newEntry.shortDescription,
      newEntry.imageSrc,
      newEntry.date,
      newEntry.categoryId,
      JSON.stringify(newEntry.categoryIds),
      JSON.stringify(newEntry.tagIds),
      newEntry.moodId,
      JSON.stringify(newEntry.moodIds)
    ],
    function(err) {
      if (err) {
        console.error("Error creating diary entry in database:", err);
        return res.status(500).json({ error: "Failed to create diary entry" });
      }
      
      console.log("Created diary entry with ID:", newEntry.id);
      res.status(201).json(newEntry);
    }
  );
};

// UPDATE a diary entry
export const updateDiaryEntry = (req, res) => {
  const { id } = req.params;
  console.log(`Updating diary entry with ID: ${id}`, req.body);
  
  const {
    title,
    content,
    shortDescription,
    imageSrc,
    date,
    categoryIds,
    tagIds,
    moodIds
  } = req.body;
  
  if (!title || !content || !date) {
    return res.status(400).json({ error: "Title, content, and date are required" });
  }
  
  const updatedEntry = {
    id,
    title,
    content,
    shortDescription: shortDescription || "",
    imageSrc: imageSrc || "",
    date,
    categoryId: categoryIds && categoryIds.length > 0 ? categoryIds[0] : null,
    categoryIds,
    tagIds: tagIds || [],
    moodId: moodIds && moodIds.length > 0 ? moodIds[0] : null,
    moodIds
  };
  
  const sql = `
    UPDATE diary_entries 
    SET title = ?, content = ?, shortDescription = ?, imageSrc = ?, date = ?,
        categoryId = ?, categoryIds = ?, tagIds = ?, moodId = ?, moodIds = ?
    WHERE id = ?
  `;
  
  db.run(
    sql,
    [
      updatedEntry.title,
      updatedEntry.content,
      updatedEntry.shortDescription,
      updatedEntry.imageSrc,
      updatedEntry.date,
      updatedEntry.categoryId,
      JSON.stringify(updatedEntry.categoryIds),
      JSON.stringify(updatedEntry.tagIds),
      updatedEntry.moodId,
      JSON.stringify(updatedEntry.moodIds),
      id
    ],
    function(err) {
      if (err) {
        console.error("Error updating entry:", err);
        return res.status(500).json({ error: "Failed to update entry" });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: `Diary entry with id ${id} not found` });
      }
      
      console.log("Entry updated:", id);
      res.json(updatedEntry);
    }
  );
};

// DELETE a diary entry
export const deleteDiaryEntry = (req, res) => {
  const { id } = req.params;
  console.log(`Deleting diary entry with ID: ${id}`);
  
  db.run("DELETE FROM diary_entries WHERE id = ?", [id], function(err) {
    if (err) {
      console.error("Error deleting entry:", err);
      return res.status(500).json({ error: "Failed to delete entry" });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: `Diary entry with id ${id} not found` });
    }
    
    res.status(204).send();
  });
};

