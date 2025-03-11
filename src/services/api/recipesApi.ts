
import { RecipeCategory, RecipeTag, RecipeDifficultyLevel } from '../../types/recipe';

/**
 * Base URL for API requests
 */
const API_BASE_URL = 'http://localhost:3001';

export function createRecipesApi() {
  return {
    /**
     * Get all recipes
     */
    getRecipes: async () => {
      const response = await fetch(`${API_BASE_URL}/recipes`);
      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }
      return response.json();
    },
    
    /**
     * Get a single recipe by ID
     */
    getRecipeById: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/recipes/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch recipe with id ${id}`);
      }
      return response.json();
    },
    
    /**
     * Get all recipe categories
     */
    getCategories: async (): Promise<RecipeCategory[]> => {
      const response = await fetch(`${API_BASE_URL}/recipes/categories`);
      if (!response.ok) {
        throw new Error('Failed to fetch recipe categories');
      }
      return response.json();
    },
    
    /**
     * Get a single recipe category by ID
     */
    getCategoryById: async (id: string): Promise<RecipeCategory | undefined> => {
      const response = await fetch(`${API_BASE_URL}/recipes/categories/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch recipe category with id ${id}`);
      }
      return response.json();
    },
    
    /**
     * Get all recipe tags
     */
    getTags: async (): Promise<RecipeTag[]> => {
      const response = await fetch(`${API_BASE_URL}/recipes/tags`);
      if (!response.ok) {
        throw new Error('Failed to fetch recipe tags');
      }
      return response.json();
    },
    
    /**
     * Get a single recipe tag by ID
     */
    getTagById: async (id: string): Promise<RecipeTag | undefined> => {
      const response = await fetch(`${API_BASE_URL}/recipes/tags/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch recipe tag with id ${id}`);
      }
      return response.json();
    },
    
    /**
     * Get recipe tags by IDs
     */
    getTagsByIds: async (ids: string[]): Promise<RecipeTag[]> => {
      const idsParam = ids.join(',');
      const response = await fetch(`${API_BASE_URL}/recipes/tags/multiple?ids=${idsParam}`);
      if (!response.ok) {
        throw new Error('Failed to fetch recipe tags by ids');
      }
      return response.json();
    },
    
    /**
     * Get all recipe difficulty levels
     */
    getDifficultyLevels: async (): Promise<RecipeDifficultyLevel[]> => {
      const response = await fetch(`${API_BASE_URL}/recipes/difficulty-levels`);
      if (!response.ok) {
        throw new Error('Failed to fetch recipe difficulty levels');
      }
      return response.json();
    },
    
    /**
     * Get a single recipe difficulty level by ID
     */
    getDifficultyLevelById: async (id: string): Promise<RecipeDifficultyLevel | undefined> => {
      const response = await fetch(`${API_BASE_URL}/recipes/difficulty-levels/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch recipe difficulty level with id ${id}`);
      }
      return response.json();
    }
  };
}
