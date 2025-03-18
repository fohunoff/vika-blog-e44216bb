
import { dbAsync } from '../../../db/config.js';
import { filterValidIds } from '../diaryUtils.js';

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
