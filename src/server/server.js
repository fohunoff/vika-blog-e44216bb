
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Import services
const recipesService = require('./recipes.service');
const diaryService = require('./diaries/diary.service');

app.use(cors());
app.use(express.json());

// Recipes endpoints
app.get('/api/recipes', (req, res) => {
  const { category, search } = req.query;
  const recipes = recipesService.getAllRecipes(category, search);
  res.json(recipes);
});

app.get('/api/recipes/:id', (req, res) => {
  const recipe = recipesService.getRecipeById(req.params.id);
  if (recipe) {
    res.json(recipe);
  } else {
    res.status(404).json({ message: 'Recipe not found' });
  }
});

app.get('/api/categories', (req, res) => {
  const categories = recipesService.getAllCategories();
  res.json(categories);
});

app.get('/api/tags', (req, res) => {
  const tags = recipesService.getAllTags();
  res.json(tags);
});

// Diary endpoints
app.get('/api/diary', (req, res) => {
  const { search, mood } = req.query;
  const entries = diaryService.getAllDiaryEntries(search, mood);
  res.json(entries);
});

app.get('/api/diary/:id', (req, res) => {
  const entry = diaryService.getDiaryEntryById(req.params.id);
  if (entry) {
    res.json(entry);
  } else {
    res.status(404).json({ message: 'Diary entry not found' });
  }
});

app.get('/api/diary/moods', (req, res) => {
  const moods = diaryService.getAllMoods();
  res.json(moods);
});

app.get('/api/diary/tags', (req, res) => {
  const tags = diaryService.getAllTags();
  res.json(tags);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
