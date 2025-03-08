
import express from 'express';
import * as recipeController from '../controllers/recipeController.js';

const router = express.Router();

// Recipe routes
router.get('/recipes', recipeController.getAllRecipes);
router.get('/recipes/:id', recipeController.getRecipeById);

// Recipe categories routes
router.get('/recipes/categories', recipeController.getCategories);
router.get('/recipes/categories/:id', recipeController.getCategoryById);

// Recipe tags routes
router.get('/recipes/tags', recipeController.getTags);
router.get('/recipes/tags/:id', recipeController.getTagById);
router.get('/recipes/tags/multiple', recipeController.getTagsByIds);

// Recipe difficulty levels routes
router.get('/recipes/difficulty-levels', recipeController.getDifficultyLevels);
router.get('/recipes/difficulty-levels/:id', recipeController.getDifficultyLevelById);

export default router;
