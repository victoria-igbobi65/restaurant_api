import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  HttpException,
  UseGuards,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { MealService } from './meal.service';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import { E_IMAGE_NOT_PROVIDED } from 'src/common/constants/constants.text';
import { Roles } from 'src/auth/decorator/user-roles.decorator';
import { Role } from 'src/common/constants/enums';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('meal')
export class MealController {
  constructor(private readonly mealService: MealService) {}

  @Post()
  // @Roles(Role.ADMIN)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() dto: CreateMealDto) {
    return this.mealService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.mealService.findAll();
  }

  @Patch('upload-image/:slug')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('image'))
  uploadMealImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('slug') slug: string,
  ) {
    if (!file) throw new HttpException(E_IMAGE_NOT_PROVIDED, 400);
    return this.mealService.uploadMealImage(file, slug);
  }

  @Get(':slug')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('slug') slug: string) {
    return this.mealService.findOne(slug);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() updateMealDto: UpdateMealDto) {
    return this.mealService.update(+id, updateMealDto);
  }

  @Delete(':slug')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(204)
  remove(@Param('slug') slug: string) {
    return this.mealService.remove(slug);
  }
}
