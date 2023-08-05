import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseInterceptors,
  UploadedFile,
  HttpException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { E_IMAGE_NOT_PROVIDED } from 'src/common/constants/constants.text';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new HttpException(E_IMAGE_NOT_PROVIDED, 400);
    return this.categoryService.create(file, createCategoryDto);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.categoryService.findCategoryBySlug(slug);
  }

  @Patch('update-image/:slug')
  @UseInterceptors(FileInterceptor('image'))
  updateCategoryImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('slug') slug: string,
  ) {
    if (!file) throw new HttpException(E_IMAGE_NOT_PROVIDED, 400);
    return this.categoryService.updateCategoryImage(file, slug);
  }
}
