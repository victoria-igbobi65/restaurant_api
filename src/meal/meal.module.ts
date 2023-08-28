import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MealService } from './meal.service';
import { MealController } from './meal.controller';
import { CloudinaryModule } from 'src/common/cloudinary/cloudinary.module';
import { Meal, MealSchema } from './models/meal.model';
import { CategoryModule } from 'src/category/category.module';

@Module({
  imports: [
    CloudinaryModule,
    CategoryModule,
    MongooseModule.forFeature([{ name: Meal.name, schema: MealSchema }]),
  ],
  controllers: [MealController],
  providers: [MealService],
  exports: [MealService],
})
export class MealModule {}
