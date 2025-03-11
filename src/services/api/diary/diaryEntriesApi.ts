
import { getDiaryOperations } from './operations/getOperations';
import { mutationDiaryOperations } from './operations/mutationOperations';

/**
 * Creates and returns the full diary entries API
 */
export function createDiaryEntriesApi() {
  const getOperations = getDiaryOperations();
  const mutationOperations = mutationDiaryOperations();

  return {
    // Get operations
    getDiaryEntries: getOperations.getDiaryEntries,
    getDiaryEntryById: getOperations.getDiaryEntryById,
    getEnrichedDiaryEntries: getOperations.getEnrichedDiaryEntries,

    // Mutation operations
    createDiaryEntry: mutationOperations.createDiaryEntry,
    updateDiaryEntry: mutationOperations.updateDiaryEntry,
    deleteDiaryEntry: mutationOperations.deleteDiaryEntry
  };
}
