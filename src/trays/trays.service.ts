import { Injectable } from '@nestjs/common';

import { MealService } from 'src/meal/meal.service';
import { SingleVirtualTrayDto } from './dto/tray.dto';

@Injectable()
export class TraysService {
  constructor(private mealService: MealService) {}

  async calculateTraysTotal(trays: SingleVirtualTrayDto[]): Promise<number> {
    let totalPrice = 0;
    for (const tray of trays) {
      for (const meal of tray.meals) {
        const mealPrice = (await this.mealService.findMealBySlug(meal.mealslug))
          .pricePerMeasurement;
        totalPrice += mealPrice * meal.quantity;
      }
    }
    console.log(totalPrice);
    return totalPrice;
  }
}
