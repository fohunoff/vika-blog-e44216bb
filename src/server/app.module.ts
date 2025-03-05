
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipesModule } from './recipes/recipes.module';
import { DiariesModule } from './diaries/diaries.module';
import { Recipe } from './recipes/entities/recipe.entity';
import { Category } from './recipes/entities/category.entity';
import { Tag } from './recipes/entities/tag.entity';
import { DiaryEntry } from './diaries/entities/diary-entry.entity';
import { DiaryMood } from './diaries/entities/diary-mood.entity';
import { DiaryTag } from './diaries/entities/diary-tag.entity';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'food_blog',
      entities: [Recipe, Category, Tag, DiaryEntry, DiaryMood, DiaryTag],
      synchronize: true, // Be careful with this in production
    }),
    RecipesModule,
    DiariesModule,
  ],
})
export class AppModule {}
