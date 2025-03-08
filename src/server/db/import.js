import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dbAsync } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read JSON data
export const readJsonFile = (relativeFilePath) => {
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
export const checkDataExists = async (tableName) => {
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

      // Import cafes
      const cafes = readJsonFile('src/data/cafes.json');
      for (const cafe of cafes) {
        await dbAsync.run(`
          INSERT INTO cafes (
            id, name, description, shortDescription, location, openHours, 
            priceRange, rating, categoryIds, tagIds, imageSrc
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          cafe.id,
          cafe.name,
          cafe.description,
          cafe.shortDescription || null,
          cafe.location,
          cafe.openHours || null,
          cafe.priceRange,
          cafe.rating,
          Array.isArray(cafe.categoryIds) ? JSON.stringify(cafe.categoryIds) : cafe.categoryIds,
          Array.isArray(cafe.tagIds) ? JSON.stringify(cafe.tagIds) : cafe.tagIds,
          cafe.imageSrc || null
        ]);
      }

      // Import cafe categories
      const cafeCategories = readJsonFile('src/data/cafe/cafe-categories.json');
      for (const category of cafeCategories) {
        await dbAsync.run('INSERT INTO cafe_categories (id, name) VALUES (?, ?)',
            [category.id, category.name]);
      }

      // Import cafe tags
      const cafeTags = readJsonFile('src/data/cafe/cafe-tags.json');
      for (const tag of cafeTags) {
        await dbAsync.run('INSERT INTO cafe_tags (id, name) VALUES (?, ?)',
            [tag.id, tag.name]);
      }

      // Import cafe price ranges
      const cafePriceRanges = readJsonFile('src/data/cafe/cafe-price-ranges.json');
      for (const priceRange of cafePriceRanges) {
        await dbAsync.run('INSERT INTO cafe_price_ranges (id, name, description) VALUES (?, ?, ?)',
            [priceRange.id, priceRange.name, priceRange.description]);
      }

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

      // Import diary categories
      const diaryCategories = readJsonFile('src/data/diary/diary-categories.json');
      for (const category of diaryCategories) {
        await dbAsync.run('INSERT INTO diary_categories (id, name) VALUES (?, ?)',
            [category.id, category.name]);
      }

      // Import diary tags
      const diaryTags = readJsonFile('src/data/diary/diary-tags.json');
      for (const tag of diaryTags) {
        await dbAsync.run('INSERT INTO diary_tags (id, name) VALUES (?, ?)',
            [tag.id, tag.name]);
      }

      // Import diary moods
      const diaryMoods = readJsonFile('src/data/diary/diary-moods.json');
      for (const mood of diaryMoods) {
        await dbAsync.run('INSERT INTO diary_moods (id, name) VALUES (?, ?)',
            [mood.id, mood.name]);
      }

      // Import diary entries
      const diaryEntries = readJsonFile('src/data/diary.json');
      for (const entry of diaryEntries) {
        // Insert entry
        await dbAsync.run(`
          INSERT INTO diary_entries (
            id, title, content, shortDescription, categoryId, moodId, publishDate, imageSrc
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          entry.id,
          entry.title,
          entry.content,
          entry.shortDescription || null,
          entry.categoryId,
          entry.moodId,
          entry.date,
          entry.imageSrc || null
        ]);

        // Insert tag mappings
        if (entry.tagIds && Array.isArray(entry.tagIds)) {
          for (const tagId of entry.tagIds) {
            await dbAsync.run('INSERT INTO diary_tag_map (diaryId, tagId) VALUES (?, ?)',
                [entry.id, tagId]);
          }
        }
      }

      // Import main navigation categories
      const mainCategories = readJsonFile('src/data/main/navigation-categories.json');
      for (const category of mainCategories) {
        await dbAsync.run(`
          INSERT INTO main_categories (
            id, title, navTitle, description, pageDescription, imageSrc, link, bgColor
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          category.id,
          category.title,
          category.navTitle,
          category.description,
          category.pageDescription || null,
          category.imageSrc,
          category.link,
          category.bgColor
        ]);
      }

      // Import main featured sections
      const featuredSections = readJsonFile('src/data/main/featured-sections.json');
      for (const section of featuredSections) {
        await dbAsync.run(`
          INSERT INTO main_featured_sections (
            id, title, description, type
          ) VALUES (?, ?, ?, ?)
        `, [
          section.id,
          section.title,
          section.description,
          section.type
        ]);
      }

      // Import main latest posts
      const latestPosts = readJsonFile('src/data/main/latest-posts.json');
      for (const post of latestPosts) {
        await dbAsync.run(`
          INSERT INTO main_latest_posts (
            id, title, excerpt, date, category, imageSrc, link
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
          post.id,
          post.title,
          post.excerpt,
          post.date,
          post.category,
          post.imageSrc,
          post.link
        ]);
      }

      // Import main hero data
      const heroData = readJsonFile('src/data/main/hero.json');
      await dbAsync.run(`
        INSERT INTO main_hero_data (
          id, tagline, title, description, 
          primaryButtonText, primaryButtonLink,
          secondaryButtonText, secondaryButtonLink,
          mainImageSrc, mainImageAlt,
          badgeText, imageCaptionTitle, imageCaptionSubtitle
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        'default',
        heroData.tagline,
        heroData.title,
        heroData.description,
        heroData.primaryButton.text,
        heroData.primaryButton.link,
        heroData.secondaryButton.text,
        heroData.secondaryButton.link,
        heroData.mainImage.src,
        heroData.mainImage.alt,
        heroData.badge.text,
        heroData.imageCaption.title,
        heroData.imageCaption.subtitle
      ]);

      // Import main about data
      const aboutData = readJsonFile('src/data/main/about.json');
      await dbAsync.run(`
        INSERT INTO main_about_data (
          id, title, paragraphs, buttonText, buttonLink, image, imageAlt
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        'default',
        aboutData.title,
        JSON.stringify(aboutData.paragraphs),
        aboutData.buttonText,
        aboutData.buttonLink,
        aboutData.image,
        aboutData.imageAlt
      ]);

      // Import main newsletter data
      const newsletterData = readJsonFile('src/data/main/newsletter.json');
      await dbAsync.run(`
        INSERT INTO main_newsletter_data (
          id, title, description, inputPlaceholder, successMessage
        ) VALUES (?, ?, ?, ?, ?)
      `, [
        'default',
        newsletterData.title,
        newsletterData.description,
        newsletterData.inputPlaceholder,
        newsletterData.successMessage
      ]);

      // Import user preferences
      const userPreferences = readJsonFile('src/data/user/user-preferences.json');
      for (const pref of userPreferences) {
        await dbAsync.run(`
          INSERT INTO user_preferences (
            id, name, type, value, isEnabled
          ) VALUES (?, ?, ?, ?, ?)
        `, [
          pref.id,
          pref.name,
          pref.type,
          pref.value,
          pref.isEnabled ? 1 : 0
        ]);
      }

      // Import comment types
      const commentTypes = readJsonFile('src/data/comments/comment-types.json');
      for (const type of commentTypes) {
        await dbAsync.run(`
          INSERT INTO comment_types (
            id, name, icon
          ) VALUES (?, ?, ?)
        `, [
          type.id,
          type.name,
          type.icon
        ]);
      }

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
