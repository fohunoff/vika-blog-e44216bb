
// Re-export all the entry controllers
import { getDiaryEntries, getDiaryEntryById, getEnrichedDiaryEntries } from './getEntryController.js';
import { createDiaryEntry } from './createEntryController.js';
import { updateDiaryEntry } from './updateEntryController.js';
import { deleteDiaryEntry } from './deleteEntryController.js';

export {
  // GET operations
  getDiaryEntries,
  getDiaryEntryById,
  getEnrichedDiaryEntries,
  
  // CREATE operation
  createDiaryEntry,
  
  // UPDATE operation
  updateDiaryEntry,
  
  // DELETE operation
  deleteDiaryEntry
};
