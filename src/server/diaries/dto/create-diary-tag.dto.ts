
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateDiaryTagDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
