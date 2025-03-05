
import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { Recipe } from './entities/recipe.entity';
import { Category } from './entities/category.entity';
import { Tag } from './entities/tag.entity';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateTagDto } from './dto/create-tag.dto';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  // Recipe endpoints
  @Get()
  findAllRecipes(
    @Query('categoryId') categoryId?: string,
    @Query('search') search?: string,
  ): Promise<Recipe[]> {
    return this.recipesService.findAllRecipes(categoryId, search);
  }

  @Get(':id')
  findRecipeById(@Param('id') id: string): Promise<Recipe> {
    return this.recipesService.findRecipeById(id);
  }

  @Post()
  createRecipe(@Body() createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    return this.recipesService.createRecipe(createRecipeDto);
  }

  @Put(':id')
  updateRecipe(
    @Param('id') id: string,
    @Body() updateRecipeDto: UpdateRecipeDto,
  ): Promise<Recipe> {
    return this.recipesService.updateRecipe(id, updateRecipeDto);
  }

  @Delete(':id')
  deleteRecipe(@Param('id') id: string): Promise<void> {
    return this.recipesService.deleteRecipe(id);
  }

  // Category endpoints
  @Get('categories')
  findAllCategories(): Promise<Category[]> {
    return this.recipesService.findAllCategories();
  }

  @Post('categories')
  createCategory(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.recipesService.createCategory(createCategoryDto);
  }

  // Tag endpoints
  @Get('tags')
  findAllTags(): Promise<Tag[]> {
    return this.recipesService.findAllTags();
  }

  @Post('tags')
  createTag(@Body() createTagDto: CreateTagDto): Promise<Tag> {
    return this.recipesService.createTag(createTagDto);
  }
}
