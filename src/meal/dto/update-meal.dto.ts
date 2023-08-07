import { PartialType } from '@nestjs/mapped-types';
import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import { CreateMealDto } from './create-meal.dto';
import { specialTags } from 'src/common/constants/enums';

export class UpdateMealDto extends PartialType(CreateMealDto) {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  readonly price?: number;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  readonly description?: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  readonly preparationTime?: number;

  @IsString({ each: true })
  @IsDefined()
  @IsEnum(specialTags, { each: true })
  @IsNotEmpty({ message: 'label cannot be empty!', each: true })
  readonly label?: [specialTags];

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  readonly nutritionalInfo?: string;
}
