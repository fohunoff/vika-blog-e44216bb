
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const app = express();

app.use(cors());
app.use(express.json());

// Настройка соединения с PostgreSQL
const pool = new Pool({
  user: process.env.DB_USERNAME || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'food_blog',
  password: process.env.DB_PASSWORD || 'postgres',
  port: parseInt(process.env.DB_PORT) || 5432,
});

// Проверка соединения с базой данных
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database', err.stack);
  } else {
    console.log('Database connected successfully at', res.rows[0].now);
  }
});

// Импорт сервиса рецептов
const recipesService = require('./recipes.service');

// Эндпоинты для рецептов
app.get('/api/recipes', (req, res) => {
  const { category, search } = req.query;
  const recipes = recipesService.getAllRecipes(category, search);
  res.json(recipes);
});

app.get('/api/recipes/:id', (req, res) => {
  const recipe = recipesService.getRecipeById(req.params.id);
  
  if (!recipe) {
    return res.status(404).json({ message: 'Recipe not found' });
  }
  
  res.json(recipe);
});

app.get('/api/recipes/categories', (req, res) => {
  const categories = recipesService.getAllCategories();
  res.json(categories);
});

app.get('/api/recipes/tags', (req, res) => {
  const tags = recipesService.getAllTags();
  res.json(tags);
});

// Эндпоинты для дневника с использованием PostgreSQL
app.get('/api/diaries', async (req, res) => {
  try {
    const { search, mood } = req.query;
    let query = `
      SELECT 
        d.id, d.title, d.date, d.content, d.image_src as "imageSrc",
        m.name as "mood",
        ARRAY_AGG(t.name) as tags
      FROM 
        diary_entries d
      JOIN 
        diary_entries_moods dem ON d.id = dem.entry_id
      JOIN 
        diary_moods m ON m.id = dem.mood_id
      LEFT JOIN 
        diary_entries_tags det ON d.id = det.entry_id
      LEFT JOIN 
        diary_tags t ON t.id = det.tag_id
      WHERE 1=1
    `;
    
    const queryParams = [];
    let paramCounter = 1;
    
    if (search) {
      query += ` AND (d.title ILIKE $${paramCounter} OR d.content ILIKE $${paramCounter})`;
      queryParams.push(`%${search}%`);
      paramCounter++;
    }
    
    if (mood) {
      query += ` AND m.name = $${paramCounter}`;
      queryParams.push(mood);
      paramCounter++;
    }
    
    query += ` GROUP BY d.id, d.title, d.date, d.content, d.image_src, m.name`;
    
    const result = await pool.query(query, queryParams);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching diary entries:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/diaries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT 
        d.id, d.title, d.date, d.content, d.image_src as "imageSrc",
        m.name as "mood",
        ARRAY_AGG(t.name) as tags
      FROM 
        diary_entries d
      JOIN 
        diary_entries_moods dem ON d.id = dem.entry_id
      JOIN 
        diary_moods m ON m.id = dem.mood_id
      LEFT JOIN 
        diary_entries_tags det ON d.id = det.entry_id
      LEFT JOIN 
        diary_tags t ON t.id = det.tag_id
      WHERE d.id = $1
      GROUP BY d.id, d.title, d.date, d.content, d.image_src, m.name
    `;
    
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Diary entry not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching diary entry:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/diaries/moods', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name FROM diary_moods');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching moods:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/diaries/tags', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        t.name, 
        COUNT(det.entry_id) as count
      FROM 
        diary_tags t
      LEFT JOIN 
        diary_entries_tags det ON t.id = det.tag_id
      GROUP BY 
        t.name
      ORDER BY 
        count DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching tags:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
