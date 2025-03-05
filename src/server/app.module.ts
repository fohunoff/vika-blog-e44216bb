
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipesModule } from './recipes/recipes.module';
import { Recipe } from './recipes/entities/recipe.entity';
import { Category } from './recipes/entities/category.entity';
import { Tag } from './recipes/entities/tag.entity';
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
      entities: [Recipe, Category, Tag],
      synchronize: true, // Be careful with this in production
    }),
    RecipesModule,
  ],
})
export class AppModule {}
