
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

// First compile the TypeScript files
console.log('Compiling TypeScript files...');
exec('npx tsc -p tsconfig.server.json', async (error, stdout, stderr) => {
  if (error) {
    console.error(`Error compiling TypeScript: ${error.message}`);
    return;
  }
  
  // Now run the seeding logic
  console.log('Seeding database...');
  
  try {
    // Import TypeORM and entities
    require('reflect-metadata');
    const { createConnection } = require('typeorm');
    const { Recipe } = require('../../dist/server/recipes/entities/recipe.entity');
    const { Category } = require('../../dist/server/recipes/entities/category.entity');
    const { Tag } = require('../../dist/server/recipes/entities/tag.entity');
    const dotenv = require('dotenv');
    
    // Load environment variables
    dotenv.config();
    
    // Create connection
    const connection = await createConnection({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'food_blog',
      entities: [Recipe, Category, Tag],
      synchronize: true,
    });
    
    // Create category repository
    const categoryRepository = connection.getRepository(Category);
    
    // Seed categories
    const categories = [
      { name: 'breakfast', displayName: 'Завтраки' },
      { name: 'soups', displayName: 'Супы' },
      { name: 'main', displayName: 'Основные блюда' },
      { name: 'desserts', displayName: 'Десерты' },
      { name: 'drinks', displayName: 'Напитки' },
    ];
    
    const savedCategories = {};
    
    for (const categoryData of categories) {
      let category = await categoryRepository.findOne({ where: { name: categoryData.name } });
      
      if (!category) {
        category = categoryRepository.create(categoryData);
        category = await categoryRepository.save(category);
        console.log(`Created category: ${category.displayName}`);
      }
      
      savedCategories[category.name] = category;
    }
    
    // Create tag repository
    const tagRepository = connection.getRepository(Tag);
    
    // Seed tags
    const tags = [
      'Вегетарианское', 'Быстрый ужин', 'Без глютена', 'Праздничное', 
      'Полезное', 'Детское', 'Веганское', 'Сезонное', 'Выпечка', 'На гриле'
    ];
    
    const savedTags = {};
    
    for (const tagName of tags) {
      let tag = await tagRepository.findOne({ where: { name: tagName } });
      
      if (!tag) {
        tag = tagRepository.create({ name: tagName });
        tag = await tagRepository.save(tag);
        console.log(`Created tag: ${tag.name}`);
      }
      
      savedTags[tag.name] = tag;
    }
    
    // Create recipe repository
    const recipeRepository = connection.getRepository(Recipe);
    
    // Seed recipes
    const recipes = [
      {
        title: 'Тыквенный суп-пюре с имбирем',
        description: 'Нежный, согревающий суп с ароматом осенних специй и ноткой имбиря.',
        categoryName: 'soups',
        time: '30 минут',
        difficulty: 'Легко',
        imageSrc: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?auto=format&fit=crop&q=80&w=2574',
        tagNames: ['Сезонное', 'Вегетарианское', 'Полезное'],
      },
      {
        title: 'Тост с авокадо и яйцом пашот',
        description: 'Идеальный питательный завтрак для энергичного начала дня.',
        categoryName: 'breakfast',
        time: '15 минут',
        difficulty: 'Легко',
        imageSrc: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=2000',
        tagNames: ['Быстрый ужин', 'Полезное'],
      },
      {
        title: 'Рататуй с прованскими травами',
        description: 'Яркое овощное блюдо с ароматными травами для любителей средиземноморской кухни.',
        categoryName: 'main',
        time: '60 минут',
        difficulty: 'Средне',
        imageSrc: 'https://images.unsplash.com/photo-1572453800999-e8d2d0d95b2b?auto=format&fit=crop&q=80&w=2000',
        tagNames: ['Вегетарианское', 'Без глютена', 'Веганское'],
      },
      {
        title: 'Павлова с летними ягодами',
        description: 'Воздушный десерт с хрустящей корочкой, нежным кремом и свежими ягодами.',
        categoryName: 'desserts',
        time: '90 минут',
        difficulty: 'Сложно',
        imageSrc: 'https://images.unsplash.com/photo-1488477181946-6428a0a36077?auto=format&fit=crop&q=80&w=2000',
        tagNames: ['Праздничное', 'Выпечка'],
      },
      {
        title: 'Латте с чаем матча',
        description: 'Бодрящий и полезный напиток с антиоксидантами и нежной молочной пенкой.',
        categoryName: 'drinks',
        time: '10 минут',
        difficulty: 'Легко',
        imageSrc: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&q=80&w=2000',
        tagNames: ['Полезное', 'Веганское'],
      },
      {
        title: 'Классический борщ с говядиной',
        description: 'Наваристый, ароматный суп со свеклой, овощами и нежной говядиной.',
        categoryName: 'soups',
        time: '120 минут',
        difficulty: 'Средне',
        imageSrc: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&q=80&w=2000',
        tagNames: ['Сезонное'],
      },
    ];
    
    for (const recipeData of recipes) {
      // Check if recipe already exists
      const existingRecipe = await recipeRepository.findOne({ 
        where: { title: recipeData.title },
        relations: ['category', 'tags']
      });
      
      if (!existingRecipe) {
        const { categoryName, tagNames, ...restRecipeData } = recipeData;
        
        // Get category
        const category = savedCategories[categoryName];
        
        // Get tags
        const recipeTags = tagNames.map(name => savedTags[name]);
        
        // Create recipe
        const recipe = recipeRepository.create({
          ...restRecipeData,
          category,
          tags: recipeTags,
        });
        
        await recipeRepository.save(recipe);
        console.log(`Created recipe: ${recipe.title}`);
      }
    }
    
    console.log('Database seeding completed successfully!');
    
    // Close the connection
    await connection.close();
    
  } catch (error) {
    console.error('Error seeding database:', error);
  }
});
