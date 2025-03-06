
/**
 * Simulates network delay for mock API calls
 * @param ms Milliseconds to delay
 */
export const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Simulates a potential API error based on probability
 * @param errorProbability Chance of error (0-1)
 * @param errorMessage Error message to throw
 */
export const simulateError = (errorProbability: number = 0.1, errorMessage: string = "API Error") => {
  if (Math.random() < errorProbability) {
    throw new Error(errorMessage);
  }
};

/**
 * Generic function to load data from JSON files
 * @param data The imported JSON data
 */
export const getData = <T>(data: T): Promise<T> => {
  return delay(300).then(() => {
    simulateError(0.05);
    return data;
  });
};

/**
 * Gets a single item by ID from a collection
 * @param items Collection of items
 * @param id ID to search for
 */
export const getById = <T extends { id: string }>(items: T[], id: string): Promise<T | undefined> => {
  return delay(200).then(() => {
    simulateError(0.05);
    return items.find(item => item.id === id);
  });
};

/**
 * Filters items by IDs
 * @param items Collection of items
 * @param ids Array of IDs to filter by
 */
export const getByIds = <T extends { id: string }>(items: T[], ids: string[]): Promise<T[]> => {
  return delay(200).then(() => {
    simulateError(0.05);
    return items.filter(item => ids.includes(item.id));
  });
};

/**
 * Enriches items with related data (like adding category or tag names)
 * @param items Main items to enrich
 * @param relationKey Key in the main items that holds related IDs
 * @param relatedItems The related items to look up from
 * @param targetKey The key to add to the main items with the related data
 */
export function enrichWithRelated<
  T extends Record<string, any>,
  R extends { id: string; name: string }
>(
  items: T[],
  relationKey: keyof T & string,
  relatedItems: R[],
  targetKey: string
): T[] {
  return items.map(item => {
    const ids = item[relationKey];
    if (!ids) return item;
    
    // Handle both single ID and array of IDs
    const relatedValues = Array.isArray(ids)
      ? ids.map(id => relatedItems.find(r => r.id === id)?.name).filter(Boolean)
      : relatedItems.find(r => r.id === ids)?.name;
      
    return {
      ...item,
      [targetKey]: relatedValues,
    };
  });
}
