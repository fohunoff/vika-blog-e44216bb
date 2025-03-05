
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';
import { Recipe } from './entities/recipe.entity';
import { Category } from './entities/category.entity';
import { Tag } from './entities/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Recipe, Category, Tag])],
  controllers: [RecipesController],
  providers: [RecipesService],
})
export class RecipesModule {}
