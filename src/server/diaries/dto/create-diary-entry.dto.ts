
import { IsString, IsNotEmpty, IsDateString, IsOptional, IsArray, IsUUID } from 'class-validator';

export class CreateDiaryEntryDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsDateString()
  date: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsUUID()
  moodId: string;

  @IsArray()
  @IsUUID('all', { each: true })
  tagIds: string[];

  @IsOptional()
  @IsString()
  imageSrc?: string;
}
