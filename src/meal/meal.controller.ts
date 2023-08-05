import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  HttpException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { MealService } from './meal.service';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import { E_IMAGE_NOT_PROVIDED } from 'src/common/constants/constants.text';

@Controller('meal')
export class MealController {
  constructor(private readonly mealService: MealService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() dto: CreateMealDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new HttpException(E_IMAGE_NOT_PROVIDED, 400);
    return this.mealService.create(dto, file);
  }

  @Get()
  findAll() {
    return this.mealService.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.mealService.findOne(slug);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMealDto: UpdateMealDto) {
    return this.mealService.update(+id, updateMealDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mealService.remove(+id);
  }
}
