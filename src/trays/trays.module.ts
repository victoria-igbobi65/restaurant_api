import { Module } from '@nestjs/common';
import { TraysController } from './trays.controller';
import { TraysService } from './trays.service';
import { MealModule } from 'src/meal/meal.module';

@Module({
  imports: [MealModule],
  controllers: [TraysController],
  providers: [TraysService],
})
export class TraysModule {}
