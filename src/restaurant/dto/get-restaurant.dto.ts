import { IsNumber, Min, Max, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class GetRestaurantsQueryDto {
  @Type(() => Number)
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat: number;

  @Type(() => Number)
  @IsNumber()
  @Min(-180)
  @Max(180)
  long: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(100)
  radius: number = 5000;
}
