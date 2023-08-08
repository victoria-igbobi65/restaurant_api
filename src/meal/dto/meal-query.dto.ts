import {
  ArrayNotEmpty,
  IsArray,
  IsBooleanString,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class MealQueryParamsDto {
  @IsOptional()
  @IsString()
  q: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  label: string[];

  @IsOptional()
  @IsBooleanString()
  isAvailable: string;

  @IsOptional()
  @IsNumberString()
  rating: string;

  @IsOptional()
  @IsString()
  category: string;

  @IsOptional()
  @IsNumberString()
  minPrice: string;

  @IsOptional()
  @IsNumberString()
  maxPrice: string;

  @IsOptional()
  @IsNumberString()
  minPreparationTime: string;

  @IsOptional()
  @IsNumberString()
  maxPreparationTime: string;
}
