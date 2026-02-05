import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ToTitleCase } from 'src/common/transformers/title-case.transformer';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  @ToTitleCase()
  name: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  sortOrder?: number;
}
