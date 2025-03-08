
import { dbAsync } from '../db/config.js';

// Get all recipes with their related data
export const getAllRecipes = async (req, res) => {
  try {
    // Get all recipes with category names
    const recipes = await dbAsync.all(`
      SELECT r.*, rc.name as categoryName
      FROM recipes r
      LEFT JOIN recipe_categories rc ON r.categoryId = rc.id
    `);
    
    // If no recipes found, return empty array
    if (recipes.length === 0) {
      return res.json([]);
    }
    
    // For each recipe, get its ingredients, steps, and tags
    const recipesWithDetails = await Promise.all(recipes.map(async (recipe) => {
      // Get ingredients
      const ingredients = await dbAsync.all(
        'SELECT * FROM recipe_ingredients WHERE recipeId = ? ORDER BY id', 
        [recipe.id]
      );
      
      // Get steps
      const stepsRows = await dbAsync.all(
        'SELECT description FROM recipe_steps WHERE recipeId = ? ORDER BY step_order', 
        [recipe.id]
      );
      const steps = stepsRows.map(s => s.description);
      
      // Get tag IDs
      const tagsRows = await dbAsync.all(
        'SELECT tagId FROM recipe_tag_map WHERE recipeId = ?', 
        [recipe.id]
      );
      const tagIds = tagsRows.map(t => t.tagId);
      
      // Return recipe with details
      return {
        ...recipe,
        ingredients,
        steps,
        tagIds
      };
    }));
    
    res.json(recipesWithDetails);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
};

// Get a single recipe by ID
export const getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get recipe with category name
    const recipe = await dbAsync.get(`
      SELECT r.*, rc.name as categoryName
      FROM recipes r
      LEFT JOIN recipe_categories rc ON r.categoryId = rc.id
      WHERE r.id = ?
    `, [id]);
    
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    
    // Get ingredients
    recipe.ingredients = await dbAsync.all(
      'SELECT * FROM recipe_ingredients WHERE recipeId = ? ORDER BY id', 
      [recipe.id]
    );
    
    // Get steps
    const stepsRows = await dbAsync.all(
      'SELECT description FROM recipe_steps WHERE recipeId = ? ORDER BY step_order', 
      [recipe.id]
    );
    recipe.steps = stepsRows.map(s => s.description);
    
    // Get tag IDs
    const tagsRows = await dbAsync.all(
      'SELECT tagId FROM recipe_tag_map WHERE recipeId = ?', 
      [recipe.id]
    );
    recipe.tagIds = tagsRows.map(t => t.tagId);
    
    res.json(recipe);
  } catch (error) {
    console.error(`Error fetching recipe ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch recipe' });
  }
};

// Get all recipe categories
export const getCategories = async (req, res) => {
  try {
    const categories = await dbAsync.all('SELECT * FROM recipe_categories');
    res.json(categories);
  } catch (error) {
    console.error('Error fetching recipe categories:', error);
    res.status(500).json({ error: 'Failed to fetch recipe categories' });
  }
};

// Get a single recipe category by ID
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await dbAsync.get('SELECT * FROM recipe_categories WHERE id = ?', [id]);
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json(category);
  } catch (error) {
    console.error(`Error fetching category ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
};

// Get all recipe tags
export const getTags = async (req, res) => {
  try {
    const tags = await dbAsync.all('SELECT * FROM recipe_tags');
    res.json(tags);
  } catch (error) {
    console.error('Error fetching recipe tags:', error);
    res.status(500).json({ error: 'Failed to fetch recipe tags' });
  }
};

// Get a single recipe tag by ID
export const getTagById = async (req, res) => {
  try {
    const { id } = req.params;
    const tag = await dbAsync.get('SELECT * FROM recipe_tags WHERE id = ?', [id]);
    
    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }
    
    res.json(tag);
  } catch (error) {
    console.error(`Error fetching tag ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch tag' });
  }
};

// Get recipe tags by multiple IDs
export const getTagsByIds = async (req, res) => {
  try {
    const { ids } = req.query;
    
    if (!ids) {
      return res.status(400).json({ error: 'IDs parameter is required' });
    }
    
    const idArray = ids.split(',');
    const placeholders = idArray.map(() => '?').join(',');
    
    const tags = await dbAsync.all(
      `SELECT * FROM recipe_tags WHERE id IN (${placeholders})`, 
      idArray
    );
    
    res.json(tags);
  } catch (error) {
    console.error('Error fetching tags by IDs:', error);
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
};

// Get all recipe difficulty levels
export const getDifficultyLevels = async (req, res) => {
  try {
    const levels = await dbAsync.all('SELECT * FROM recipe_difficulty_levels');
    res.json(levels);
  } catch (error) {
    console.error('Error fetching difficulty levels:', error);
    res.status(500).json({ error: 'Failed to fetch difficulty levels' });
  }
};

// Get a single recipe difficulty level by ID
export const getDifficultyLevelById = async (req, res) => {
  try {
    const { id } = req.params;
    const level = await dbAsync.get('SELECT * FROM recipe_difficulty_levels WHERE id = ?', [id]);
    
    if (!level) {
      return res.status(404).json({ error: 'Difficulty level not found' });
    }
    
    res.json(level);
  } catch (error) {
    console.error(`Error fetching difficulty level ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch difficulty level' });
  }
};
