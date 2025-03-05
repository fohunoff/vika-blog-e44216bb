
import { IsNotEmpty, IsString, IsOptional, IsEnum, IsArray, IsNumber, IsUUID } from 'class-validator';

export class CreateRecipeDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  time?: string;

  @IsEnum(['Легко', 'Средне', 'Сложно'])
  difficulty: 'Легко' | 'Средне' | 'Сложно';

  @IsNotEmpty()
  @IsString()
  imageSrc: string;

  @IsOptional()
  @IsNumber()
  servings?: number;

  @IsNotEmpty()
  @IsUUID()
  categoryId: string;

  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  tagIds?: string[];
}
