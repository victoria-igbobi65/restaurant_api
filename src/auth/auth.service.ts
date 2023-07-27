import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

import { User } from './models/user.model';
import { createUserDto } from './dto/create-user.dto';
import {
  E_USER_EXISTS,
  E_INCORRECT_CREDENTIALS,
} from 'src/common/constants/constants.text';
import { loginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private authModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(dto: createUserDto) {
    let user = await this.findUserByCredentials(dto.email, dto.phonenumber); // check if user with credentials exists in the db
    if (user) throw new HttpException(E_USER_EXISTS, 409); // throw error if user with any of the credentials exists

    user = await this.authModel.create(dto); // create new user
    const token = await this.signToken(user); // sign token for new user

    user.password = undefined;
    return { user, token };
  }

  async login(dto: loginDto) {
    const user = await this.findUserByCredentials(dto.email, dto.phonenumber);

    if (!user || !(await user?.validatePassword(dto.password))) {
      throw new HttpException(E_INCORRECT_CREDENTIALS, 400);
    }

    const token = await this.signToken(user);
    user.password = undefined;
    return { user, token };
  }

  async signToken(dto: User) {
    return this.jwtService.sign({
      sub: dto.id,
      email: dto.email,
      role: dto.role,
    });
  }

  async findUserByEmail(email: string) {
    return this.authModel.findOne({ email: email });
  }

  async findUserByGoogleId(googleId: string) {
    return this.authModel.findOne({ googleId: googleId });
  }

  async findUserByCredentials(email: string, phonenumber: string) {
    return this.authModel
      .findOne({ $or: [{ email }, { phonenumber }] })
      .select('+password');
  }
}
