import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from './models/user.model';
import { createUserDto } from './dto/create-user.dto';
import { E_USER_EXISTS } from 'src/common/constants/constants.text';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async createUser(dto: createUserDto) {
    const user = await this.findUserByCredentials(dto.email, dto.phonenumber); // check if user with credentials exists in the db
    if (user) throw new HttpException(E_USER_EXISTS, 409); // throw error if user with any of the credentials exists

    return await this.userModel.create(dto); // create new user
  }

  async uploadProfilePicToCloudinary(file: Express.Multer.File) {
    const profilePic = await this.cloudinaryService.uploadImage(file);
    return profilePic;
  }

  async findUserByEmail(email: string) {
    return this.userModel.findOne({ email: email });
  }

  async findUserByGoogleId(googleId: string) {
    return this.userModel.findOne({ googleId: googleId });
  }

  async findUserByCredentials(email: string, phonenumber: string) {
    return this.userModel
      .findOne({ $or: [{ email }, { phonenumber }] })
      .select('+password');
  }
}
