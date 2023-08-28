import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class TrayMealsDto {
  @IsString()
  @IsDefined()
  @IsNotEmpty({ message: 'Meal slug required!' })
  mealslug: string;

  @Min(1)
  @IsNumber()
  @IsDefined()
  quantity: number;
}
