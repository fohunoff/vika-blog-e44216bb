
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
