
import { dbAsync } from '../../db/config.js';

// Utility function to validate IDs against existing records
export async function validateIds(typeTable, ids) {
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
export async function filterValidIds(typeTable, ids) {
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

// Utility function to remove an ID from all diary entries
export async function removeIdFromEntries(idToRemove, idType) {
  try {
    const entries = await dbAsync.all('SELECT id, categoryIds, tagIds, moodIds FROM diary_entries');
    
    for (const entry of entries) {
      let updated = false;
      let categoryIds = JSON.parse(entry.categoryIds || '[]');
      let tagIds = JSON.parse(entry.tagIds || '[]');
      let moodIds = JSON.parse(entry.moodIds || '[]');
      
      // Update the appropriate array based on the ID type
      if (idType === 'category' && categoryIds.includes(idToRemove)) {
        categoryIds = categoryIds.filter(id => id !== idToRemove);
        updated = true;
      } else if (idType === 'tag' && tagIds.includes(idToRemove)) {
        tagIds = tagIds.filter(id => id !== idToRemove);
        updated = true;
      } else if (idType === 'mood' && moodIds.includes(idToRemove)) {
        moodIds = moodIds.filter(id => id !== idToRemove);
        updated = true;
      }
      
      // If we've removed an ID, update the entry
      if (updated) {
        const categoryId = categoryIds.length > 0 ? categoryIds[0] : null;
        const moodId = moodIds.length > 0 ? moodIds[0] : null;
        
        await dbAsync.run(
          `UPDATE diary_entries 
           SET categoryIds = ?, 
               categoryId = ?,
               tagIds = ?, 
               moodIds = ?,
               moodId = ?,
               updatedAt = CURRENT_TIMESTAMP
           WHERE id = ?`,
          [
            JSON.stringify(categoryIds),
            categoryId,
            JSON.stringify(tagIds),
            JSON.stringify(moodIds),
            moodId,
            entry.id
          ]
        );
        console.log(`Updated entry ${entry.id} to remove ${idType} ID: ${idToRemove}`);
      }
    }
    console.log(`Removed ${idType} ID ${idToRemove} from all entries`);
  } catch (error) {
    console.error(`Error removing ${idType} ID from entries:`, error);
    throw new Error(`Failed to update entries after ${idType} deletion`);
  }
}
