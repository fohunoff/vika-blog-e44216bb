import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { Recipe } from './entities/recipe.entity';
import { Category } from './entities/category.entity';
import { Tag } from './entities/tag.entity';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateTagDto } from './dto/create-tag.dto';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private recipesRepository: Repository<Recipe>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(Tag)
    private tagsRepository: Repository<Tag>,
  ) {}

  async findAllRecipes(categoryId?: string, search?: string): Promise<Recipe[]> {
    const query: any = {
      relations: ['category', 'tags'],
    };

    if (categoryId) {
      query.where = { category: { id: categoryId } };
    }

    if (search) {
      query.where = query.where || {};
      query.where.title = Like(`%${search}%`);
    }

    return this.recipesRepository.find(query);
  }

  async findRecipeById(id: string): Promise<Recipe> {
    const recipe = await this.recipesRepository.findOne({
      where: { id },
      relations: ['category', 'tags'],
    });

    if (!recipe) {
      throw new NotFoundException(`Recipe with ID ${id} not found`);
    }

    return recipe;
  }

  async createRecipe(createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    const { categoryId, tagIds, ...recipeData } = createRecipeDto;

    // Find the category
    const category = await this.categoriesRepository.findOne({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    // Find tags if provided
    let tags = [];
    if (tagIds && tagIds.length > 0) {
      tags = await this.tagsRepository.findBy({ id: In(tagIds) });
    }

    // Create and save the recipe
    const recipe = this.recipesRepository.create({
      ...recipeData,
      category,
      tags,
    });

    return this.recipesRepository.save(recipe);
  }

  async updateRecipe(id: string, updateRecipeDto: UpdateRecipeDto): Promise<Recipe> {
    const { categoryId, tagIds, ...recipeData } = updateRecipeDto;

    // Get the existing recipe
    const recipe = await this.findRecipeById(id);

    // Update category if provided
    if (categoryId) {
      const category = await this.categoriesRepository.findOne({
        where: { id: categoryId },
      });

      if (!category) {
        throw new NotFoundException(`Category with ID ${categoryId} not found`);
      }

      recipe.category = category;
    }

    // Update tags if provided
    if (tagIds) {
      const tags = await this.tagsRepository.findBy({ id: In(tagIds) });
      recipe.tags = tags;
    }

    // Update other recipe properties
    Object.assign(recipe, recipeData);

    return this.recipesRepository.save(recipe);
  }

  async deleteRecipe(id: string): Promise<void> {
    const result = await this.recipesRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Recipe with ID ${id} not found`);
    }
  }

  // Category methods
  async findAllCategories(): Promise<Category[]> {
    return this.categoriesRepository.find();
  }

  async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoriesRepository.create(createCategoryDto);
    return this.categoriesRepository.save(category);
  }

  // Tag methods
  async findAllTags(): Promise<Tag[]> {
    return this.tagsRepository.find();
  }

  async createTag(createTagDto: CreateTagDto): Promise<Tag> {
    const tag = this.tagsRepository.create(createTagDto);
    return this.tagsRepository.save(tag);
  }
}
