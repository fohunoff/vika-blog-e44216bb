import { db, dbAsync } from './config.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { closeDatabase as closeDbConnection } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create database tables
export const createTables = async () => {
  console.log('Creating database tables...');
  
  try {
    // Recipe Categories
    await dbAsync.run(`
      CREATE TABLE IF NOT EXISTS recipe_categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL
      )
    `);
    
    // Recipe Tags
    await dbAsync.run(`
      CREATE TABLE IF NOT EXISTS recipe_tags (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL
      )
    `);
    
    // Recipe Difficulty Levels
    await dbAsync.run(`
      CREATE TABLE IF NOT EXISTS recipe_difficulty_levels (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT
      )
    `);
    
    // Recipes
    await dbAsync.run(`
      CREATE TABLE IF NOT EXISTS recipes (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        shortDescription TEXT,
        fullDescription TEXT,
        categoryId TEXT,
        time TEXT,
        difficulty TEXT,
        imageSrc TEXT,
        prepTime TEXT,
        cookTime TEXT,
        publishDate TEXT,
        FOREIGN KEY (categoryId) REFERENCES recipe_categories(id)
      )
    `);
    
    // Recipe Ingredients
    await dbAsync.run(`
      CREATE TABLE IF NOT EXISTS recipe_ingredients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        recipeId TEXT,
        name TEXT NOT NULL,
        amount TEXT,
        FOREIGN KEY (recipeId) REFERENCES recipes(id)
      )
    `);
    
    // Recipe Steps
    await dbAsync.run(`
      CREATE TABLE IF NOT EXISTS recipe_steps (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        recipeId TEXT,
        step_order INTEGER,
        description TEXT NOT NULL,
        FOREIGN KEY (recipeId) REFERENCES recipes(id)
      )
    `);
    
    // Recipe Tags Junction Table
    await dbAsync.run(`
      CREATE TABLE IF NOT EXISTS recipe_tag_map (
        recipeId TEXT,
        tagId TEXT,
        PRIMARY KEY (recipeId, tagId),
        FOREIGN KEY (recipeId) REFERENCES recipes(id),
        FOREIGN KEY (tagId) REFERENCES recipe_tags(id)
      )
    `);
    
    // Cozy Articles
    await dbAsync.run(`
      CREATE TABLE IF NOT EXISTS cozy_articles (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        content TEXT,
        isHighlight BOOLEAN DEFAULT 0,
        imageSrc TEXT,
        typeId TEXT,
        publishDate TEXT,
        categoryId TEXT
      )
    `);
    
    // Cozy Article Tags Junction Table
    await dbAsync.run(`
      CREATE TABLE IF NOT EXISTS cozy_tag_map (
        articleId TEXT,
        tagId TEXT,
        PRIMARY KEY (articleId, tagId),
        FOREIGN KEY (articleId) REFERENCES cozy_articles(id),
        FOREIGN KEY (tagId) REFERENCES cozy_tags(id)
      )
    `);
    
    // Cozy Tags
    await dbAsync.run(`
      CREATE TABLE IF NOT EXISTS cozy_tags (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL
      )
    `);
    
    // Cozy Categories
    await dbAsync.run(`
      CREATE TABLE IF NOT EXISTS cozy_categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL
      )
    `);
    
    // Cozy Highlight Types
    await dbAsync.run(`
      CREATE TABLE IF NOT EXISTS cozy_highlight_types (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL
      )
    `);
    
    // Diary Entries
    await dbAsync.run(`
      CREATE TABLE IF NOT EXISTS diary_entries (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT,
        categoryId TEXT,
        moodId TEXT,
        publishDate TEXT,
        imageSrc TEXT
      )
    `);
    
    // Diary Tags Junction Table
    await dbAsync.run(`
      CREATE TABLE IF NOT EXISTS diary_tag_map (
        diaryId TEXT,
        tagId TEXT,
        PRIMARY KEY (diaryId, tagId)
      )
    `);
    
    // Diary Tags
    await dbAsync.run(`
      CREATE TABLE IF NOT EXISTS diary_tags (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL
      )
    `);
    
    // Diary Categories
    await dbAsync.run(`
      CREATE TABLE IF NOT EXISTS diary_categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL
      )
    `);
    
    // Diary Moods
    await dbAsync.run(`
      CREATE TABLE IF NOT EXISTS diary_moods (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL
      )
    `);
    
    console.log('Database tables created successfully');
    return true;
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
};

// Read JSON data
const readJsonFile = (relativeFilePath) => {
  const absolutePath = path.join(__dirname, '../../../', relativeFilePath);
  try {
    const fileData = fs.readFileSync(absolutePath, 'utf8');
    return JSON.parse(fileData);
  } catch (error) {
    console.error(`Error reading file ${relativeFilePath}:`, error);
    return [];
  }
};

// Check if data exists in a table
const checkDataExists = async (tableName) => {
  try {
    const row = await dbAsync.get(`SELECT COUNT(*) as count FROM ${tableName}`);
    return row && row.count > 0;
  } catch (error) {
    console.error(`Error checking data in ${tableName}:`, error);
    return false;
  }
};

// Import data from JSON files
export const importData = async () => {
  console.log('Checking if data import is needed...');
  
  try {
    // Only import if recipe categories table is empty
    const dataExists = await checkDataExists('recipe_categories');
    
    if (!dataExists) {
      console.log('Importing data from JSON files...');
      
      // Import recipe categories
      const recipeCategories = readJsonFile('src/data/recipe/recipe-categories.json');
      for (const category of recipeCategories) {
        await dbAsync.run('INSERT INTO recipe_categories (id, name) VALUES (?, ?)', 
          [category.id, category.name]);
      }
      
      // Import recipe tags
      const recipeTags = readJsonFile('src/data/recipe/recipe-tags.json');
      for (const tag of recipeTags) {
        await dbAsync.run('INSERT INTO recipe_tags (id, name) VALUES (?, ?)', 
          [tag.id, tag.name]);
      }
      
      // Import recipe difficulty levels
      const difficultyLevels = readJsonFile('src/data/recipe/recipe-difficulty-levels.json');
      for (const level of difficultyLevels) {
        await dbAsync.run('INSERT INTO recipe_difficulty_levels (id, name, description) VALUES (?, ?, ?)', 
          [level.id, level.name, level.description]);
      }
      
      // Import recipes and related data
      const recipes = readJsonFile('src/data/recipes.json');
      for (const recipe of recipes) {
        // Insert recipe
        await dbAsync.run(`
          INSERT INTO recipes (
            id, title, shortDescription, fullDescription, 
            categoryId, time, difficulty, imageSrc, publishDate
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          recipe.id,
          recipe.title,
          recipe.shortDescription,
          recipe.fullDescription,
          recipe.categoryId,
          recipe.time,
          recipe.difficulty,
          recipe.imageSrc,
          recipe.publishDate
        ]);
        
        // Insert ingredients
        if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
          for (const ingredient of recipe.ingredients) {
            await dbAsync.run('INSERT INTO recipe_ingredients (recipeId, name, amount) VALUES (?, ?, ?)', 
              [recipe.id, ingredient.name, ingredient.amount]);
          }
        }
        
        // Insert steps
        if (recipe.steps && Array.isArray(recipe.steps)) {
          for (let i = 0; i < recipe.steps.length; i++) {
            await dbAsync.run('INSERT INTO recipe_steps (recipeId, step_order, description) VALUES (?, ?, ?)', 
              [recipe.id, i + 1, recipe.steps[i]]);
          }
        }
        
        // Insert tag mappings
        if (recipe.tagIds && Array.isArray(recipe.tagIds)) {
          for (const tagId of recipe.tagIds) {
            await dbAsync.run('INSERT INTO recipe_tag_map (recipeId, tagId) VALUES (?, ?)', 
              [recipe.id, tagId]);
          }
        }
      }
      
      // Import cozy categories
      const cozyCategories = readJsonFile('src/data/cozy/cozy-categories.json');
      for (const category of cozyCategories) {
        await dbAsync.run('INSERT INTO cozy_categories (id, name) VALUES (?, ?)', 
          [category.id, category.name]);
      }
      
      // Import cozy tags
      const cozyTags = readJsonFile('src/data/cozy/cozy-tags.json');
      for (const tag of cozyTags) {
        await dbAsync.run('INSERT INTO cozy_tags (id, name) VALUES (?, ?)', 
          [tag.id, tag.name]);
      }
      
      // Import cozy highlight types
      const cozyHighlightTypes = readJsonFile('src/data/cozy/cozy-highlights-types.json');
      for (const type of cozyHighlightTypes) {
        await dbAsync.run('INSERT INTO cozy_highlight_types (id, name) VALUES (?, ?)', 
          [type.id, type.name]);
      }
      
      // Import cozy articles
      const cozyArticles = readJsonFile('src/data/cozy.json');
      for (const article of cozyArticles) {
        // Get category ID from name
        let categoryId = null;
        if (article.category) {
          const category = cozyCategories.find(c => c.name === article.category);
          if (category) categoryId = category.id;
        }
        
        // Insert article
        await dbAsync.run(`
          INSERT INTO cozy_articles (
            id, title, content, isHighlight, imageSrc, typeId, publishDate, categoryId
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          article.id,
          article.title,
          article.content,
          article.isHighlight ? 1 : 0,
          article.image,
          article.typeId,
          article.date,
          categoryId
        ]);
        
        // Insert tag mappings if tags exist
        if (article.tags && Array.isArray(article.tags)) {
          for (const tagName of article.tags) {
            const tag = cozyTags.find(t => t.name === tagName);
            if (tag) {
              await dbAsync.run('INSERT INTO cozy_tag_map (articleId, tagId) VALUES (?, ?)', 
                [article.id, tag.id]);
            }
          }
        }
      }
      
      // Import diary categories, tags, moods, entries
      // These would follow the same pattern
      
      console.log('Data import completed successfully');
    } else {
      console.log('Database already contains data, skipping import');
    }
    
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    throw error;
  }
};

// Initialize database
export const initializeDatabase = async () => {
  console.log('Initializing database...');
  
  try {
    await createTables();
    await importData();
    console.log('Database initialization completed');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Close database connection
export const closeDatabase = async () => {
  console.log('Closing database connection...');
  try {
    await closeDbConnection();
    return true;
  } catch (error) {
    console.error('Error closing database connection:', error);
    throw error;
  }
};
