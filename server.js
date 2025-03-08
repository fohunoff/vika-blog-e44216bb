
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

// Enable CORS
app.use(cors());

// Helper function to read JSON data
const readJsonFile = (filePath) => {
  const absolutePath = path.join(__dirname, filePath);
  const fileData = fs.readFileSync(absolutePath, 'utf8');
  return JSON.parse(fileData);
};

// Recipes routes
app.get('/recipes', (req, res) => {
  try {
    const recipes = readJsonFile('src/data/recipes.json');
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

app.get('/recipes/:id', (req, res) => {
  try {
    const recipes = readJsonFile('src/data/recipes.json');
    const recipe = recipes.find(r => r.id === req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recipe' });
  }
});

app.get('/recipes/categories', (req, res) => {
  try {
    const categories = readJsonFile('src/data/recipe/recipe-categories.json');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recipe categories' });
  }
});

app.get('/recipes/categories/:id', (req, res) => {
  try {
    const categories = readJsonFile('src/data/recipe/recipe-categories.json');
    const category = categories.find(c => c.id === req.params.id);
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

app.get('/recipes/tags', (req, res) => {
  try {
    const tags = readJsonFile('src/data/recipe/recipe-tags.json');
    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recipe tags' });
  }
});

app.get('/recipes/tags/:id', (req, res) => {
  try {
    const tags = readJsonFile('src/data/recipe/recipe-tags.json');
    const tag = tags.find(t => t.id === req.params.id);
    
    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }
    
    res.json(tag);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tag' });
  }
});

app.get('/recipes/tags/multiple', (req, res) => {
  try {
    const { ids } = req.query;
    
    if (!ids) {
      return res.status(400).json({ error: 'IDs parameter is required' });
    }
    
    const idArray = ids.split(',');
    const tags = readJsonFile('src/data/recipe/recipe-tags.json');
    const filteredTags = tags.filter(tag => idArray.includes(tag.id));
    
    res.json(filteredTags);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
});

app.get('/recipes/difficulty-levels', (req, res) => {
  try {
    const levels = readJsonFile('src/data/recipe/recipe-difficulty-levels.json');
    res.json(levels);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch difficulty levels' });
  }
});

app.get('/recipes/difficulty-levels/:id', (req, res) => {
  try {
    const levels = readJsonFile('src/data/recipe/recipe-difficulty-levels.json');
    const level = levels.find(l => l.id === req.params.id);
    
    if (!level) {
      return res.status(404).json({ error: 'Difficulty level not found' });
    }
    
    res.json(level);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch difficulty level' });
  }
});

// Cozy routes
app.get('/cozy/articles', (req, res) => {
  try {
    const articles = readJsonFile('src/data/cozy.json');
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cozy articles' });
  }
});

app.get('/cozy/highlights', (req, res) => {
  try {
    const articles = readJsonFile('src/data/cozy.json');
    const highlights = articles.filter(article => article.isHighlight);
    res.json(highlights);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cozy highlights' });
  }
});

// Add other routes here for cafes, diary, etc.

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
