
import express from 'express';
import { 
  getRecipes, getRecipeById, getRecipeCategories, 
  getRecipeCategoryById, getRecipeTags, getRecipeTagById,
  getRecipeTagsByIds, getRecipeDifficultyLevels, getRecipeDifficultyLevelById 
} from '../controllers/recipeController.js';

const router = express.Router();

/**
 * @swagger
 * /recipes:
 *   get:
 *     summary: Get all recipes
 *     tags: [Recipes]
 *     responses:
 *       200:
 *         description: A list of recipes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Recipe'
 */
router.get('/recipes', getRecipes);

/**
 * @swagger
 * /recipes/{id}:
 *   get:
 *     summary: Get a recipe by ID
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Recipe ID
 *     responses:
 *       200:
 *         description: Recipe details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       404:
 *         description: Recipe not found
 */
router.get('/recipes/:id', getRecipeById);

/**
 * @swagger
 * /recipes/categories:
 *   get:
 *     summary: Get all recipe categories
 *     tags: [Recipes]
 *     responses:
 *       200:
 *         description: A list of recipe categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RecipeCategory'
 */
router.get('/recipes/categories', getRecipeCategories);

/**
 * @swagger
 * /recipes/categories/{id}:
 *   get:
 *     summary: Get a recipe category by ID
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RecipeCategory'
 *       404:
 *         description: Category not found
 */
router.get('/recipes/categories/:id', getRecipeCategoryById);

/**
 * @swagger
 * /recipes/tags:
 *   get:
 *     summary: Get all recipe tags
 *     tags: [Recipes]
 *     responses:
 *       200:
 *         description: A list of recipe tags
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RecipeTag'
 */
router.get('/recipes/tags', getRecipeTags);

/**
 * @swagger
 * /recipes/tags/{id}:
 *   get:
 *     summary: Get a recipe tag by ID
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Tag ID
 *     responses:
 *       200:
 *         description: Tag details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RecipeTag'
 *       404:
 *         description: Tag not found
 */
router.get('/recipes/tags/:id', getRecipeTagById);

/**
 * @swagger
 * /recipes/tags/multiple:
 *   get:
 *     summary: Get recipe tags by IDs
 *     tags: [Recipes]
 *     parameters:
 *       - in: query
 *         name: ids
 *         schema:
 *           type: string
 *         required: true
 *         description: Comma-separated tag IDs
 *     responses:
 *       200:
 *         description: List of tags
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RecipeTag'
 */
router.get('/recipes/tags/multiple', getRecipeTagsByIds);

/**
 * @swagger
 * /recipes/difficulty-levels:
 *   get:
 *     summary: Get all recipe difficulty levels
 *     tags: [Recipes]
 *     responses:
 *       200:
 *         description: A list of difficulty levels
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id: 
 *                     type: string
 *                   name: 
 *                     type: string
 */
router.get('/recipes/difficulty-levels', getRecipeDifficultyLevels);

/**
 * @swagger
 * /recipes/difficulty-levels/{id}:
 *   get:
 *     summary: Get a recipe difficulty level by ID
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Difficulty level ID
 *     responses:
 *       200:
 *         description: Difficulty level details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id: 
 *                   type: string
 *                 name: 
 *                   type: string
 *       404:
 *         description: Difficulty level not found
 */
router.get('/recipes/difficulty-levels/:id', getRecipeDifficultyLevelById);

export default router;
