
import recipeCategories from '../../data/recipe/recipe-categories.json';
import recipeTags from '../../data/recipe/recipe-tags.json';
import recipeDifficultyLevels from '../../data/recipe/recipe-difficulty-levels.json';
import recipes from '../../data/recipes.json';
import { 
  getData, 
  getById, 
  getByIds, 
  paginateData, 
  PaginationOptions, 
  PaginatedResponse 
} from './utils';
import { RecipeCategory, RecipeTag, RecipeDifficultyLevel } from '../../types/models';

export function createRecipesApi() {
  return {
    /**
     * Get all recipes
     */
    getRecipes: () => {
      return getData(recipes);
    },
    
    /**
     * Get paginated recipes
     */
    getPaginatedRecipes: (options?: PaginationOptions): Promise<PaginatedResponse<any>> => {
      return getData(recipes).then(allRecipes => {
        return paginateData(allRecipes, options);
      });
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
    },
    
    /**
     * Get all recipe difficulty levels
     */
    getDifficultyLevels: (): Promise<RecipeDifficultyLevel[]> => {
      return getData(recipeDifficultyLevels as RecipeDifficultyLevel[]);
    },
    
    /**
     * Get a single recipe difficulty level by ID
     */
    getDifficultyLevelById: (id: string): Promise<RecipeDifficultyLevel | undefined> => {
      return getById(recipeDifficultyLevels as RecipeDifficultyLevel[], id);
    },
    
    /**
     * Get enriched recipes with category and tag information
     */
    getEnrichedRecipes: async () => {
      const allRecipes = await getData(recipes);
      const categories = await getData(recipeCategories as RecipeCategory[]);
      const tags = await getData(recipeTags as RecipeTag[]);
      
      return allRecipes.map((recipe: any) => ({
        ...recipe,
        category: categories.find(c => c.id === recipe.categoryId)?.name,
        tags: recipe.tagIds?.map((id: string) => tags.find(t => t.id === id)?.name).filter(Boolean)
      }));
    },
    
    /**
     * Get paginated enriched recipes
     */
    getPaginatedEnrichedRecipes: async (options?: PaginationOptions) => {
      const enrichedRecipes = await this.getEnrichedRecipes();
      return paginateData(enrichedRecipes, options);
    }
  };
}
