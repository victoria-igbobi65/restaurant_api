import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { Category } from './models/meal-categories.model';
import {
  E_CATEGORY_EXISTS,
  E_CATEGORY_NOT_EXISTS,
} from 'src/common/constants/constants.text';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(file: Express.Multer.File, dto: CreateCategoryDto) {
    const categoryImage = await this.cloudinaryService.uploadImage(file);
    let category = await this.findCategoryByName(dto.name);
    if (category) throw new HttpException(E_CATEGORY_EXISTS, 409);
    category = await this.categoryModel.create({
      name: dto.name,
      imageUrl: categoryImage.url,
    });
    return { category };
  }

  async findAll() {
    const data = await this.categoryModel.find();
    return { count: data.length, data };
  }

  async findOne(slug: string) {
    const category = await this.findCategoryBySlug(slug);
    if (!category) throw new HttpException(E_CATEGORY_NOT_EXISTS, 404);
    return { category };
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
  async findCategoryByName(name: string) {
    return this.categoryModel.findOne({ name });
  }

  async findCategoryBySlug(slug: string) {
    return this.categoryModel.findOne({ slug });
  }
}
