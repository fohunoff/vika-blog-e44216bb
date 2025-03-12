
/**
 * Helper function to ensure values are properly handled as arrays
 * Used for consistent handling of multi-select fields in diary entries
 */
export const ensureArray = (value: any): string[] => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }
  return [];
};

/**
 * Process a diary entry response to ensure all array fields are correctly handled
 */
export const processEntryResponse = (entry: any) => {
  if (!entry) return entry;

  return {
    ...entry,
    tagIds: ensureArray(entry.tagIds),
    categoryIds: ensureArray(entry.categoryIds),
    moodIds: ensureArray(entry.moodIds),
  };
};

/**
 * Process an array of diary entries to ensure all array fields are correctly handled
 */
export const processEntriesResponse = (entries: any[]) => {
  if (!Array.isArray(entries)) return [];

  return entries.map(entry => processEntryResponse(entry));
};

/**
 * Prepare data for API requests by ensuring array fields are properly formatted
 */
export const prepareEntryData = (data: any) => {
  return {
    ...data,
    tagIds: Array.isArray(data.tagIds) ? data.tagIds : [],
    categoryIds: Array.isArray(data.categoryIds) ? data.categoryIds : [],
    moodIds: Array.isArray(data.moodIds) ? data.moodIds : []
  };
};
