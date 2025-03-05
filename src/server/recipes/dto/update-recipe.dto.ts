
import { IsOptional, IsString, IsEnum, IsArray, IsNumber, IsUUID } from 'class-validator';

export class UpdateRecipeDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  time?: string;

  @IsOptional()
  @IsEnum(['Легко', 'Средне', 'Сложно'])
  difficulty?: 'Легко' | 'Средне' | 'Сложно';

  @IsOptional()
  @IsString()
  imageSrc?: string;

  @IsOptional()
  @IsNumber()
  servings?: number;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  tagIds?: string[];
}
