import { dbAsync } from './config.js';

// Create database tables
export const createTables = async () => {
  console.log('Creating database tables...');

  try {
    // Cafes - добавляем эту таблицу
    await dbAsync.run(`
      CREATE TABLE IF NOT EXISTS cafes (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        shortDescription TEXT,
        imageSrc TEXT,
        location TEXT,
        openHours TEXT,
        priceRange TEXT,
        rating REAL,
        categoryIds TEXT,
        tagIds TEXT,
        website TEXT,
        phone TEXT,
        address TEXT
      )
    `);

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

    // Cafe Categories
    await dbAsync.run(`
      CREATE TABLE IF NOT EXISTS cafe_categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL
      )
    `);

    // Cafe Tags
    await dbAsync.run(`
      CREATE TABLE IF NOT EXISTS cafe_tags (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL
      )
    `);

    // Cafe Price Ranges
    await dbAsync.run(`
      CREATE TABLE IF NOT EXISTS cafe_price_ranges (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT
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
        content TEXT NOT NULL,
        shortDescription TEXT,
        imageSrc TEXT,
        date TEXT NOT NULL,
        categoryId TEXT,
        categoryIds TEXT,
        tagIds TEXT,
        moodId TEXT,
        moodIds TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Diary Categories
    await dbAsync.run(`
      CREATE TABLE IF NOT EXISTS diary_categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        image TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Diary Tags
    await dbAsync.run(`
      CREATE TABLE IF NOT EXISTS diary_tags (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Diary Moods
    await dbAsync.run(`
      CREATE TABLE IF NOT EXISTS diary_moods (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        icon TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Main Navigation Categories
    await dbAsync.run(`
      CREATE TABLE IF NOT EXISTS main_categories (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        navTitle TEXT NOT NULL,
        description TEXT,
        pageDescription TEXT,
        imageSrc TEXT,
        link TEXT,
        bgColor TEXT
      )
    `);

    // Main Featured Sections
    await dbAsync.run(`
      CREATE TABLE IF NOT EXISTS main_featured_sections (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        type TEXT
      )
    `);

    // Latest Posts
    await dbAsync.run(`
      CREATE TABLE IF NOT EXISTS main_latest_posts (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        excerpt TEXT,
        date TEXT,
        category TEXT,
        imageSrc TEXT,
        link TEXT
      )
    `);

    // Hero Data
    await dbAsync.run(`
      CREATE TABLE IF NOT EXISTS main_hero_data (
        id TEXT PRIMARY KEY DEFAULT 'default',
        tagline TEXT,
        title TEXT,
        description TEXT,
        primaryButtonText TEXT,
        primaryButtonLink TEXT,
        secondaryButtonText TEXT,
        secondaryButtonLink TEXT,
        mainImageSrc TEXT,
        mainImageAlt TEXT,
        badgeText TEXT,
        imageCaptionTitle TEXT,
        imageCaptionSubtitle TEXT
      )
    `);

    // About Data
    await dbAsync.run(`
      CREATE TABLE IF NOT EXISTS main_about_data (
        id TEXT PRIMARY KEY DEFAULT 'default',
        title TEXT,
        paragraphs TEXT, -- Stored as JSON array
        buttonText TEXT,
        buttonLink TEXT,
        image TEXT,
        imageAlt TEXT
      )
    `);

    // Newsletter Data
    await dbAsync.run(`
      CREATE TABLE IF NOT EXISTS main_newsletter_data (
        id TEXT PRIMARY KEY DEFAULT 'default',
        title TEXT,
        description TEXT,
        inputPlaceholder TEXT,
        successMessage TEXT
      )
    `);

    // User Preferences
    await dbAsync.run(`
      CREATE TABLE IF NOT EXISTS user_preferences (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        value TEXT,
        isEnabled BOOLEAN DEFAULT 0
      )
    `);

    // Comment Types
    await dbAsync.run(`
      CREATE TABLE IF NOT EXISTS comment_types (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        icon TEXT
      )
    `);

    // Comments
    await dbAsync.run(`
      CREATE TABLE IF NOT EXISTS comments (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        content TEXT NOT NULL,
        date TEXT,
        typeId TEXT,
        parentId TEXT,
        targetType TEXT NOT NULL,
        targetId TEXT NOT NULL,
        FOREIGN KEY (typeId) REFERENCES comment_types(id),
        FOREIGN KEY (parentId) REFERENCES comments(id)
      )
    `);

    console.log('Database tables created successfully');
    return true;
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
};

// Schema for the database tables
export const tables = [
  {
    name: 'cafes',
    sql: `
      CREATE TABLE IF NOT EXISTS cafes (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        shortDescription TEXT,
        imageSrc TEXT,
        location TEXT,
        openHours TEXT,
        priceRange TEXT,
        rating REAL,
        categoryIds TEXT,
        tagIds TEXT,
        website TEXT,
        phone TEXT,
        address TEXT
      )
    `,
    indexes: [
      'CREATE INDEX IF NOT EXISTS idx_cafes_name ON cafes(name)'
    ]
  },
  {
    name: 'recipe_categories',
    sql: `
      CREATE TABLE IF NOT EXISTS recipe_categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL
      )
    `
  },
  {
    name: 'recipe_tags',
    sql: `
      CREATE TABLE IF NOT EXISTS recipe_tags (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL
      )
    `
  },
  {
    name: 'recipe_difficulty_levels',
    sql: `
      CREATE TABLE IF NOT EXISTS recipe_difficulty_levels (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT
      )
    `
  },
  {
    name: 'recipes',
    sql: `
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
    `
  },
  {
    name: 'recipe_ingredients',
    sql: `
      CREATE TABLE IF NOT EXISTS recipe_ingredients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        recipeId TEXT,
        name TEXT NOT NULL,
        amount TEXT,
        FOREIGN KEY (recipeId) REFERENCES recipes(id)
      )
    `
  },
  {
    name: 'recipe_steps',
    sql: `
      CREATE TABLE IF NOT EXISTS recipe_steps (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        recipeId TEXT,
        step_order INTEGER,
        description TEXT NOT NULL,
        FOREIGN KEY (recipeId) REFERENCES recipes(id)
      )
    `
  },
  {
    name: 'recipe_tag_map',
    sql: `
      CREATE TABLE IF NOT EXISTS recipe_tag_map (
        recipeId TEXT,
        tagId TEXT,
        PRIMARY KEY (recipeId, tagId),
        FOREIGN KEY (recipeId) REFERENCES recipes(id),
        FOREIGN KEY (tagId) REFERENCES recipe_tags(id)
      )
    `
  },
  {
    name: 'cafe_categories',
    sql: `
      CREATE TABLE IF NOT EXISTS cafe_categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL
      )
    `
  },
  {
    name: 'cafe_tags',
    sql: `
      CREATE TABLE IF NOT EXISTS cafe_tags (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL
      )
    `
  },
  {
    name: 'cafe_price_ranges',
    sql: `
      CREATE TABLE IF NOT EXISTS cafe_price_ranges (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT
      )
    `
  },
  {
    name: 'cozy_articles',
    sql: `
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
    `
  },
  {
    name: 'cozy_tag_map',
    sql: `
      CREATE TABLE IF NOT EXISTS cozy_tag_map (
        articleId TEXT,
        tagId TEXT,
        PRIMARY KEY (articleId, tagId),
        FOREIGN KEY (articleId) REFERENCES cozy_articles(id),
        FOREIGN KEY (tagId) REFERENCES cozy_tags(id)
      )
    `
  },
  {
    name: 'cozy_tags',
    sql: `
      CREATE TABLE IF NOT EXISTS cozy_tags (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL
      )
    `
  },
  {
    name: 'cozy_categories',
    sql: `
      CREATE TABLE IF NOT EXISTS cozy_categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL
      )
    `
  },
  {
    name: 'cozy_highlight_types',
    sql: `
      CREATE TABLE IF NOT EXISTS cozy_highlight_types (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL
      )
    `
  },
  {
    name: 'diary_entries',
    sql: `
      CREATE TABLE IF NOT EXISTS diary_entries (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        shortDescription TEXT,
        imageSrc TEXT,
        date TEXT NOT NULL,
        categoryId TEXT,
        categoryIds TEXT,
        tagIds TEXT,
        moodId TEXT,
        moodIds TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `,
    indexes: [
      'CREATE INDEX IF NOT EXISTS idx_diary_entries_date ON diary_entries(date)'
    ]
  },
  {
    name: 'diary_categories',
    sql: `
      CREATE TABLE IF NOT EXISTS diary_categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        image TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
  },
  {
    name: 'diary_tags',
    sql: `
      CREATE TABLE IF NOT EXISTS diary_tags (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
  },
  {
    name: 'diary_moods',
    sql: `
      CREATE TABLE IF NOT EXISTS diary_moods (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        icon TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
  }
];
