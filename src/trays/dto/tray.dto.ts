import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { TrayMealsDto } from './meal.dto';

export class SingleVirtualTrayDto {
  @ValidateNested({ each: true })
  @Type(() => TrayMealsDto)
  meals: TrayMealsDto[];
}
