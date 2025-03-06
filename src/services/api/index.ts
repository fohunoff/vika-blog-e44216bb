
import { createHomeApi } from "./homeApi";
import { createRecipesApi } from "./recipesApi";
import { createDiaryApi } from "./diaryApi";
import { createCafesApi } from "./cafesApi";

/**
 * Creates a unified API object with all endpoints
 */
export function createApi() {
  return {
    home: createHomeApi(),
    recipes: createRecipesApi(),
    diary: createDiaryApi(),
    cafes: createCafesApi(),
  };
}

// Create a singleton instance of the API
export const api = createApi();
