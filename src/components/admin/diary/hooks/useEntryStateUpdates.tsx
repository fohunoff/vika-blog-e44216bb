
import { DiaryEntry } from "@/types/diary";

export const useEntryStateUpdates = (
  setEntries: React.Dispatch<React.SetStateAction<DiaryEntry[]>>,
  setState?: (state: any) => void
) => {
  // Helper function to update entries array with correct sorting
  const updateEntriesList = (newEntry: DiaryEntry) => {
    setEntries(prevEntries => {
      // First check if this entry already exists (for updates)
      const existingIndex = prevEntries.findIndex(e => e.id === newEntry.id);
      
      // Prepare the entry with proper multi-select fields
      const preparedEntry = {
        ...newEntry,
        categoryIds: newEntry.categoryIds || [newEntry.categoryId],
        moodIds: newEntry.moodIds || [newEntry.moodId]
      };
      
      let updatedEntries;
      if (existingIndex >= 0) {
        // Update existing entry
        updatedEntries = [...prevEntries];
        updatedEntries[existingIndex] = preparedEntry;
      } else {
        // Add new entry
        updatedEntries = [...prevEntries, preparedEntry];
      }
      
      // Sort by date (newest first)
      return updatedEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });
  };

  // Helper function to update dialog state with selected values after operation
  const updateDialogState = (entry: DiaryEntry) => {
    if (setState) {
      setState((prev: any) => ({
        ...prev,
        selectedTags: entry.tagIds || [],
        selectedCategories: entry.categoryIds || (entry.categoryId ? [entry.categoryId] : []),
        selectedMoods: entry.moodIds || (entry.moodId ? [entry.moodId] : [])
      }));
    }
  };

  return {
    updateEntriesList,
    updateDialogState
  };
};
