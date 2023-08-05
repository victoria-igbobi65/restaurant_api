import {
  IsDefined,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsMongoId,
  IsEnum,
} from 'class-validator';
import { specialTags } from 'src/common/constants/enums';

export class CreateMealDto {
  @IsString()
  @IsDefined()
  @IsNotEmpty({ message: 'Meal name is required!' })
  readonly name: string;

  @IsNumber({})
  @IsNotEmpty({ message: 'price is required!' })
  @IsPositive({ message: 'Price must not be less than 0' })
  readonly price: number;

  @IsString()
  @IsDefined()
  @IsNotEmpty({ message: 'description cannot be empty!' })
  readonly description: string;

  @IsMongoId()
  @IsNotEmpty({ message: 'category cannot be empty!' })
  readonly category: string;

  @IsString()
  @IsEnum(specialTags)
  @IsOptional()
  @IsNotEmpty({ message: 'label cannot be empty!' })
  readonly label: specialTags;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @IsNotEmpty({ message: 'preparation time cannot be empty!' })
  readonly preparationTime: number;

  @IsString()
  @IsDefined()
  @IsOptional()
  @IsNotEmpty({ message: 'nutritionalInfo cannot be empty!' })
  readonly nutritionalInfo: string;
}
