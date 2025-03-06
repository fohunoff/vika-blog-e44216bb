
import recipeCategories from '../../data/recipe-categories.json';
import recipeTags from '../../data/recipe-tags.json';
import recipes from '../../data/recipes.json';
import { getData, getById, getByIds } from './utils';
import { RecipeCategory, RecipeTag } from '../../types/models';

export function createRecipesApi() {
  return {
    /**
     * Get all recipes
     */
    getRecipes: () => {
      return getData(recipes);
    },
    
    /**
     * Get a single recipe by ID
     */
    getRecipeById: (id: string) => {
      return getById(recipes, id);
    },
    
    /**
     * Get all recipe categories
     */
    getCategories: (): Promise<RecipeCategory[]> => {
      return getData(recipeCategories as RecipeCategory[]);
    },
    
    /**
     * Get a single recipe category by ID
     */
    getCategoryById: (id: string): Promise<RecipeCategory | undefined> => {
      return getById(recipeCategories as RecipeCategory[], id);
    },
    
    /**
     * Get all recipe tags
     */
    getTags: (): Promise<RecipeTag[]> => {
      return getData(recipeTags as RecipeTag[]);
    },
    
    /**
     * Get a single recipe tag by ID
     */
    getTagById: (id: string): Promise<RecipeTag | undefined> => {
      return getById(recipeTags as RecipeTag[], id);
    },
    
    /**
     * Get recipe tags by IDs
     */
    getTagsByIds: (ids: string[]): Promise<RecipeTag[]> => {
      return getByIds(recipeTags as RecipeTag[], ids);
    }
  };
}
