import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ToTitleCase } from 'src/common/transformers/title-case.transformer';

export class CreateMenuItemDto {
  @IsNotEmpty()
  @IsString()
  @ToTitleCase()
  @MaxLength(50)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  @MinLength(10)
  description: string;

  @IsBoolean()
  @Transform(({ value }) => value === true || value === 'true')
  isVeg: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) =>
    value === undefined ? true : value === true || value === 'true'
  )
  isAvailable?: boolean = true;

  @IsNotEmpty()
  @IsUrl({ require_protocol: true })
  imageUrl: string;

  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(0)
  price: number;
}
