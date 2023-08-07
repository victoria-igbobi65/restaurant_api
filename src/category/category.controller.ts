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
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { E_IMAGE_NOT_PROVIDED } from 'src/common/constants/constants.text';
import { Roles } from 'src/auth/decorator/user-roles.decorator';
import { Role } from 'src/common/constants/enums';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new HttpException(E_IMAGE_NOT_PROVIDED, 400);
    return this.categoryService.create(file, createCategoryDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':slug')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('slug') slug: string) {
    return this.categoryService.findCategoryBySlug(slug);
  }

  @Patch('update-image/:slug')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('image'))
  updateCategoryImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('slug') slug: string,
  ) {
    if (!file) throw new HttpException(E_IMAGE_NOT_PROVIDED, 400);
    return this.categoryService.updateCategoryImage(file, slug);
  }
}
