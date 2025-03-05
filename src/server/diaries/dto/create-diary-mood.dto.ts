
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateDiaryMoodDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
