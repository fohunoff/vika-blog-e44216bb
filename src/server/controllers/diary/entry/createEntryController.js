
import { dbAsync } from '../../../db/config.js';
import { v4 as uuidv4 } from 'uuid';
import { validateIds } from '../diaryUtils.js';

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
