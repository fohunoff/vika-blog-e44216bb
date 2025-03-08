
const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3001;

// Enable CORS
app.use(cors());

// Initialize SQLite database
const dbPath = path.join(__dirname, 'blog_data.db');
const db = new sqlite3.Database(dbPath);

// Database initialization function
const initializeDatabase = () => {
  console.log('Initializing database...');
  
  // Create tables
  db.serialize(() => {
    // Recipe Categories
    db.run(`
      CREATE TABLE IF NOT EXISTS recipe_categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL
      )
    `);
    
    // Recipe Tags
    db.run(`
      CREATE TABLE IF NOT EXISTS recipe_tags (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL
      )
    `);
    
    // Recipe Difficulty Levels
    db.run(`
      CREATE TABLE IF NOT EXISTS recipe_difficulty_levels (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT
      )
    `);
    
    // Recipes
    db.run(`
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
    db.run(`
      CREATE TABLE IF NOT EXISTS recipe_ingredients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        recipeId TEXT,
        name TEXT NOT NULL,
        amount TEXT,
        FOREIGN KEY (recipeId) REFERENCES recipes(id)
      )
    `);
    
    // Recipe Steps
    db.run(`
      CREATE TABLE IF NOT EXISTS recipe_steps (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        recipeId TEXT,
        step_order INTEGER,
        description TEXT NOT NULL,
        FOREIGN KEY (recipeId) REFERENCES recipes(id)
      )
    `);
    
    // Recipe Tags Junction Table
    db.run(`
      CREATE TABLE IF NOT EXISTS recipe_tag_map (
        recipeId TEXT,
        tagId TEXT,
        PRIMARY KEY (recipeId, tagId),
        FOREIGN KEY (recipeId) REFERENCES recipes(id),
        FOREIGN KEY (tagId) REFERENCES recipe_tags(id)
      )
    `);
    
    // Cozy Articles
    db.run(`
      CREATE TABLE IF NOT EXISTS cozy_articles (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        content TEXT,
        isHighlight BOOLEAN DEFAULT 0,
        imageSrc TEXT,
        typeId TEXT,
        publishDate TEXT
      )
    `);
    
    // Diary Entries
    db.run(`
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
    db.run(`
      CREATE TABLE IF NOT EXISTS diary_tag_map (
        diaryId TEXT,
        tagId TEXT,
        PRIMARY KEY (diaryId, tagId)
      )
    `);
  });
  
  // Import data from JSON files
  importDataFromJson();
};

// Import data from JSON files to database
const importDataFromJson = () => {
  const fs = require('fs');
  
  // Helper function to read JSON data
  const readJsonFile = (filePath) => {
    const absolutePath = path.join(__dirname, filePath);
    const fileData = fs.readFileSync(absolutePath, 'utf8');
    return JSON.parse(fileData);
  };
  
  // Check if data already exists
  db.get('SELECT COUNT(*) as count FROM recipe_categories', (err, row) => {
    if (err) {
      console.error('Error checking database:', err);
      return;
    }
    
    // Only import if no data exists
    if (row && row.count === 0) {
      console.log('Importing data from JSON files...');
      
      // Import recipe categories
      const recipeCategories = readJsonFile('src/data/recipe/recipe-categories.json');
      const categoryStmt = db.prepare('INSERT INTO recipe_categories (id, name) VALUES (?, ?)');
      recipeCategories.forEach(category => {
        categoryStmt.run(category.id, category.name);
      });
      categoryStmt.finalize();
      
      // Import recipe tags
      const recipeTags = readJsonFile('src/data/recipe/recipe-tags.json');
      const tagStmt = db.prepare('INSERT INTO recipe_tags (id, name) VALUES (?, ?)');
      recipeTags.forEach(tag => {
        tagStmt.run(tag.id, tag.name);
      });
      tagStmt.finalize();
      
      // Import recipe difficulty levels
      const difficultyLevels = readJsonFile('src/data/recipe/recipe-difficulty-levels.json');
      const difficultyStmt = db.prepare('INSERT INTO recipe_difficulty_levels (id, name, description) VALUES (?, ?, ?)');
      difficultyLevels.forEach(level => {
        difficultyStmt.run(level.id, level.name, level.description);
      });
      difficultyStmt.finalize();
      
      // Import recipes
      const recipes = readJsonFile('src/data/recipes.json');
      const recipeStmt = db.prepare(`
        INSERT INTO recipes (
          id, title, shortDescription, fullDescription, 
          categoryId, time, difficulty, imageSrc, publishDate
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      const ingredientStmt = db.prepare('INSERT INTO recipe_ingredients (recipeId, name, amount) VALUES (?, ?, ?)');
      const stepStmt = db.prepare('INSERT INTO recipe_steps (recipeId, step_order, description) VALUES (?, ?, ?)');
      const tagMapStmt = db.prepare('INSERT INTO recipe_tag_map (recipeId, tagId) VALUES (?, ?)');
      
      recipes.forEach(recipe => {
        recipeStmt.run(
          recipe.id,
          recipe.title,
          recipe.shortDescription,
          recipe.fullDescription,
          recipe.categoryId,
          recipe.time,
          recipe.difficulty,
          recipe.imageSrc,
          recipe.publishDate
        );
        
        // Insert ingredients
        if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
          recipe.ingredients.forEach(ingredient => {
            ingredientStmt.run(recipe.id, ingredient.name, ingredient.amount);
          });
        }
        
        // Insert steps
        if (recipe.steps && Array.isArray(recipe.steps)) {
          recipe.steps.forEach((step, index) => {
            stepStmt.run(recipe.id, index + 1, step);
          });
        }
        
        // Insert tag mappings
        if (recipe.tagIds && Array.isArray(recipe.tagIds)) {
          recipe.tagIds.forEach(tagId => {
            tagMapStmt.run(recipe.id, tagId);
          });
        }
      });
      
      recipeStmt.finalize();
      ingredientStmt.finalize();
      stepStmt.finalize();
      tagMapStmt.finalize();
      
      console.log('Data import completed successfully');
    } else {
      console.log('Database already contains data, skipping import');
    }
  });
};

// Initialize database
initializeDatabase();

// API Routes
// Recipe Categories
app.get('/recipes/categories', (req, res) => {
  db.all('SELECT * FROM recipe_categories', (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch recipe categories' });
    }
    res.json(rows);
  });
});

app.get('/recipes/categories/:id', (req, res) => {
  db.get('SELECT * FROM recipe_categories WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch category' });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json(row);
  });
});

// Recipe Tags
app.get('/recipes/tags', (req, res) => {
  db.all('SELECT * FROM recipe_tags', (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch recipe tags' });
    }
    res.json(rows);
  });
});

app.get('/recipes/tags/:id', (req, res) => {
  db.get('SELECT * FROM recipe_tags WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch tag' });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Tag not found' });
    }
    
    res.json(row);
  });
});

app.get('/recipes/tags/multiple', (req, res) => {
  const { ids } = req.query;
  
  if (!ids) {
    return res.status(400).json({ error: 'IDs parameter is required' });
  }
  
  const idArray = ids.split(',');
  const placeholders = idArray.map(() => '?').join(',');
  
  db.all(`SELECT * FROM recipe_tags WHERE id IN (${placeholders})`, idArray, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch tags' });
    }
    
    res.json(rows);
  });
});

// Recipe Difficulty Levels
app.get('/recipes/difficulty-levels', (req, res) => {
  db.all('SELECT * FROM recipe_difficulty_levels', (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch difficulty levels' });
    }
    res.json(rows);
  });
});

app.get('/recipes/difficulty-levels/:id', (req, res) => {
  db.get('SELECT * FROM recipe_difficulty_levels WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch difficulty level' });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Difficulty level not found' });
    }
    
    res.json(row);
  });
});

// Recipes
app.get('/recipes', (req, res) => {
  db.all(`
    SELECT r.*, rc.name as categoryName
    FROM recipes r
    LEFT JOIN recipe_categories rc ON r.categoryId = rc.id
  `, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch recipes' });
    }
    
    // Get all recipe IDs
    const recipeIds = rows.map(r => r.id);
    
    if (recipeIds.length === 0) {
      return res.json([]);
    }
    
    const recipesWithDetails = [...rows];
    let completedQueries = 0;
    const totalQueries = recipeIds.length * 3; // 3 queries per recipe (ingredients, steps, tags)
    
    // Function to check if all queries are complete
    const checkComplete = () => {
      completedQueries++;
      if (completedQueries === totalQueries) {
        res.json(recipesWithDetails);
      }
    };
    
    // For each recipe, get ingredients, steps, and tags
    recipesWithDetails.forEach(recipe => {
      recipe.ingredients = [];
      recipe.steps = [];
      recipe.tagIds = [];
      
      // Get ingredients
      db.all('SELECT * FROM recipe_ingredients WHERE recipeId = ? ORDER BY id', [recipe.id], (err, ingredients) => {
        if (!err && ingredients) {
          recipe.ingredients = ingredients;
        }
        checkComplete();
      });
      
      // Get steps
      db.all('SELECT * FROM recipe_steps WHERE recipeId = ? ORDER BY step_order', [recipe.id], (err, steps) => {
        if (!err && steps) {
          recipe.steps = steps.map(s => s.description);
        }
        checkComplete();
      });
      
      // Get tag IDs
      db.all('SELECT tagId FROM recipe_tag_map WHERE recipeId = ?', [recipe.id], (err, tags) => {
        if (!err && tags) {
          recipe.tagIds = tags.map(t => t.tagId);
        }
        checkComplete();
      });
    });
  });
});

app.get('/recipes/:id', (req, res) => {
  db.get(`
    SELECT r.*, rc.name as categoryName
    FROM recipes r
    LEFT JOIN recipe_categories rc ON r.categoryId = rc.id
    WHERE r.id = ?
  `, [req.params.id], (err, recipe) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch recipe' });
    }
    
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    
    // Get ingredients
    db.all('SELECT * FROM recipe_ingredients WHERE recipeId = ? ORDER BY id', [recipe.id], (err, ingredients) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to fetch recipe ingredients' });
      }
      
      recipe.ingredients = ingredients;
      
      // Get steps
      db.all('SELECT description FROM recipe_steps WHERE recipeId = ? ORDER BY step_order', [recipe.id], (err, steps) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Failed to fetch recipe steps' });
        }
        
        recipe.steps = steps.map(s => s.description);
        
        // Get tags
        db.all('SELECT tagId FROM recipe_tag_map WHERE recipeId = ?', [recipe.id], (err, tags) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to fetch recipe tags' });
          }
          
          recipe.tagIds = tags.map(t => t.tagId);
          
          res.json(recipe);
        });
      });
    });
  });
});

// Cozy Articles Routes
app.get('/cozy/articles', (req, res) => {
  // Implement cozy articles endpoints
  res.json([]);
});

app.get('/cozy/highlights', (req, res) => {
  // Implement cozy highlights endpoints
  res.json([]);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Database location: ${dbPath}`);
});

// Handle application shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Database connection closed');
    process.exit(0);
  });
});
