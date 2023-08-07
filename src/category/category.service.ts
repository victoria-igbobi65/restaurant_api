import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateCategoryDto } from './dto/create-category.dto';
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
    return { category };
  }

  async updateCategoryImage(file: Express.Multer.File, slug: string) {
    const categoryImage = await this.cloudinaryService.uploadImage(file);

    const category = await this.findCategoryBySlug(slug);
    category.imageUrl = categoryImage.url;
    await category.save();

    return { category };
  }

  async findCategoryByName(name: string) {
    const category = await this.categoryModel.findOne({
      name: { $regex: `^${name}$`, $options: 'i' },
    });
    if (category) throw new HttpException(E_CATEGORY_EXISTS, 409);
    return category;
  }

  async findCategoryBySlug(slug: string) {
    const category = await this.categoryModel.findOne({ slug });
    if (!category) throw new HttpException(E_CATEGORY_NOT_EXISTS, 404);
    return category;
  }

  async findCategoryById(id: string) {
    const category = await this.categoryModel.findOne({ _id: id });
    if (!category) throw new HttpException(E_CATEGORY_NOT_EXISTS, 404);
    return category;
  }
}
