import { Transform } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPostalCode,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { IsIndianState } from 'src/common/decorators/is-indian-state.decorator';
import { ToTitleCase } from 'src/common/transformers/title-case.transformer';

export class CreateRestaurantDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  @ToTitleCase()
  name: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : (value as unknown)
  )
  address: string;

  @IsPostalCode('IN')
  @IsNotEmpty()
  pinCode: string;

  @IsIndianState({ message: 'State must be a valid Indian State' })
  @ToTitleCase()
  stateName: string;

  @IsString()
  @IsNotEmpty()
  @ToTitleCase()
  city: string;

  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (!Array.isArray(value)) {
      return value as unknown;
    }
    return value.map((item: string) =>
      typeof item === 'string'
        ? item
            .trim()
            .toLowerCase()
            .replace(/\b\w/g, (l) => l.toUpperCase())
        : (item as unknown)
    );
  })
  cuisineType: string[];
}
