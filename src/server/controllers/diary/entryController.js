
// Re-export all entry controller methods from the new structure
import {
  getDiaryEntries,
  getDiaryEntryById,
  getEnrichedDiaryEntries,
  createDiaryEntry,
  updateDiaryEntry,
  deleteDiaryEntry
} from './entry/index.js';

export {
  getDiaryEntries,
  getDiaryEntryById,
  getEnrichedDiaryEntries,
  createDiaryEntry,
  updateDiaryEntry,
  deleteDiaryEntry
};
