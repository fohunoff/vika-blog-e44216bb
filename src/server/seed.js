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
    const { DiaryEntry } = require('../../dist/server/diaries/entities/diary-entry.entity');
    const { DiaryMood } = require('../../dist/server/diaries/entities/diary-mood.entity');
    const { DiaryTag } = require('../../dist/server/diaries/entities/diary-tag.entity');
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
      entities: [Recipe, Category, Tag, DiaryEntry, DiaryMood, DiaryTag],
      synchronize: true,
    });
    
    // Create category repository and seed recipes data
    const categoryRepository = connection.getRepository(Category);
    
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
    
    // Create tag repository and seed tags data
    const tagRepository = connection.getRepository(Tag);
    
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
    
    // Create recipe repository and seed recipes data
    const recipeRepository = connection.getRepository(Recipe);
    
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
    
    // Seed diary moods
    const diaryMoodRepository = connection.getRepository(DiaryMood);
    
    const moods = [
      { name: 'Радость' },
      { name: 'Умиротворение' },
      { name: 'Вдохновение' },
      { name: 'Ностальгия' },
      { name: 'Задумчивость' },
      { name: 'Предвкушение' },
      { name: 'Грусть' },
      { name: 'Любопытство' }
    ];
    
    const savedMoods = {};
    
    for (const moodData of moods) {
      let mood = await diaryMoodRepository.findOne({ where: { name: moodData.name } });
      
      if (!mood) {
        mood = diaryMoodRepository.create(moodData);
        mood = await diaryMoodRepository.save(mood);
        console.log(`Created mood: ${mood.name}`);
      }
      
      savedMoods[mood.name] = mood;
    }
    
    // Seed diary tags
    const diaryTagRepository = connection.getRepository(DiaryTag);
    
    const diaryTags = [
      'осень', 'зима', 'книги', 'прогулки', 'кулинария', 'эксперименты', 
      'осенние рецепты', 'планы', 'хобби', 'друзья', 'погода', 'уют',
      'утро', 'ритуалы', 'медитация', 'новый год', 'рефлексия'
    ];
    
    const savedDiaryTags = {};
    
    for (const tagName of diaryTags) {
      let tag = await diaryTagRepository.findOne({ where: { name: tagName } });
      
      if (!tag) {
        tag = diaryTagRepository.create({ name: tagName });
        tag = await diaryTagRepository.save(tag);
        console.log(`Created diary tag: ${tag.name}`);
      }
      
      savedDiaryTags[tag.name] = tag;
    }
    
    // Seed diary entries
    const diaryEntryRepository = connection.getRepository(DiaryEntry);
    
    const diaryEntries = [
      {
        title: 'Осенние размышления',
        date: '2023-10-15',
        content: 'Сегодня я гуляла по парку и наблюдала, как желтеют листья. Осень всегда навевает на меня особое настроение — смесь меланхолии и умиротворения. Решила начать новую книгу и заварить любимый чай с корицей.',
        moodName: 'Умиротворение',
        tagNames: ['осень', 'книги', 'прогулки'],
        imageSrc: 'https://images.unsplash.com/photo-1506202687253-52e1b29d3527?auto=format&fit=crop&q=80&w=2000',
      },
      {
        title: 'Эксперименты на кухне',
        date: '2023-11-02',
        content: 'Пробовала приготовить новый рецепт тыквенного пирога. Добавила немного имбиря и корицы — получилось восхитительно! Домашние оценили, особенно с чашкой горячего какао.',
        moodName: 'Вдохновение',
        tagNames: ['кулинария', 'эксперименты', 'осенние рецепты'],
        imageSrc: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=2000',
      },
      {
        title: 'Планы на выходные',
        date: '2023-11-10',
        content: 'Составила список дел на предстоящие выходные: посетить новую выставку в галерее, встретиться с друзьями в том уютном кафе на углу и закончить вязать шарф, который начала еще месяц назад.',
        moodName: 'Предвкушение',
        tagNames: ['планы', 'хобби', 'друзья'],
        imageSrc: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&q=80&w=2000',
      },
      {
        title: 'Приближение зимы',
        date: '2023-11-28',
        content: 'Сегодня выпал первый снег. Я люблю это волшебное время, когда природа замирает в ожидании зимы. Достала теплые свитера и решила, что пора обновить зимний гардероб.',
        moodName: 'Ностальгия',
        tagNames: ['зима', 'погода', 'уют'],
        imageSrc: 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?auto=format&fit=crop&q=80&w=2000',
      },
      {
        title: 'Утренние ритуалы',
        date: '2023-12-05',
        content: 'Начала практиковать новый утренний ритуал - вставать на 30 минут раньше, чтобы выпить чашку чая в тишине и помедитировать. Всего неделя, а уже чувствую себя более сосредоточенной и спокойной.',
        moodName: 'Умиротворение',
        tagNames: ['утро', 'ритуалы', 'медитация'],
        imageSrc: 'https://images.unsplash.com/photo-1495214783159-3503fd1b572d?auto=format&fit=crop&q=80&w=2000',
      },
      {
        title: 'Мысли о новом годе',
        date: '2023-12-20',
        content: 'Задумалась о том, как быстро пролетел этот год. Столько всего произошло, столько планов реализовано, но и многое осталось незавершенным. Пора составлять список целей на следующий год.',
        moodName: 'Задумчивость',
        tagNames: ['новый год', 'планы', 'рефлексия'],
        imageSrc: 'https://images.unsplash.com/photo-1482330454287-3cf6209df976?auto=format&fit=crop&q=80&w=2000',
      }
    ];
    
    for (const entryData of diaryEntries) {
      // Check if entry already exists
      const existingEntry = await diaryEntryRepository.findOne({ 
        where: { title: entryData.title },
        relations: ['mood', 'tags']
      });
      
      if (!existingEntry) {
        const { moodName, tagNames, ...restEntryData } = entryData;
        
        // Get mood
        const mood = savedMoods[moodName];
        
        // Get tags
        const entryTags = tagNames.map(name => savedDiaryTags[name]);
        
        // Create entry
        const entry = diaryEntryRepository.create({
          ...restEntryData,
          mood,
          tags: entryTags,
        });
        
        await diaryEntryRepository.save(entry);
        console.log(`Created diary entry: ${entry.title}`);
      }
    }
    
    console.log('Database seeding completed successfully!');
    
    // Close the connection
    await connection.close();
    
  } catch (error) {
    console.error('Error seeding database:', error);
  }
});
