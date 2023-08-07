import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import { Meal } from './models/meal.model';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import {
  E_MEAL_EXISTS,
  E_MEAL_NOT_EXIST,
} from 'src/common/constants/constants.text';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class MealService {
  constructor(
    @InjectModel(Meal.name) private mealModel: Model<Meal>,
    private cloudinaryService: CloudinaryService,
    private categoryService: CategoryService,
  ) {}

  async create(dto: CreateMealDto) {
    await this.categoryService.findCategoryById(dto.category);
    let data = await this.findMealByName(dto.name);
    data = await this.mealModel.create(dto);
    return { data };
  }

  async uploadMealImage(file: Express.Multer.File, slug: string) {
    const meal = await this.findMealBySlug(slug);
    const mealImage = await this.cloudinaryService.uploadImage(file);
    meal.imageUrl = mealImage.url;
    await meal.save();
    return { meal };
  }

  async findAll() {
    const data = await this.mealModel.find();
    return { count: data.length, data };
  }

  async findOne(slug: string) {
    const data = await this.findMealBySlug(slug);
    return { data };
  }

  async update(id: number, updateMealDto: UpdateMealDto) {
    return `This action updates a #${id} meal`;
  }

  async remove(slug: string) {
    const data = await this.mealModel.findOneAndDelete({ slug: slug });
    if (!data) throw new HttpException(E_MEAL_NOT_EXIST, 404);
    return;
  }

  async findMealByName(name: string) {
    const meal = await this.mealModel.findOne({
      name: { $regex: `^${name}$`, $options: 'i' },
    });
    if (meal) throw new HttpException(E_MEAL_EXISTS, 409);
    return meal;
  }

  async findMealBySlug(slug: string) {
    const meal = await this.mealModel
      .findOne({ slug: slug })
      .populate('category')
      .exec();
    if (!meal) throw new HttpException(E_MEAL_NOT_EXIST, 404);
    return meal;
  }
}
