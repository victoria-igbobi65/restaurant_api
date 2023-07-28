import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { User } from 'src/users/models/user.model';
import { createUserDto } from 'src/users/dto/create-user.dto';
import { E_INCORRECT_CREDENTIALS } from 'src/common/constants/constants.text';
import { loginDto } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: createUserDto) {
    const user = await this.usersService.createUser(dto);
    const token = await this.signToken(user);

    return { user, token };
  }

  async login(dto: loginDto) {
    const user = await this.usersService.findUserByCredentials(
      dto.email,
      dto.phonenumber,
    );
    if (!user || !(await user?.validatePassword(dto.password))) {
      throw new HttpException(E_INCORRECT_CREDENTIALS, 400);
    }
    const token = await this.signToken(user);
    return { user, token };
  }

  async signToken(dto: User) {
    return this.jwtService.sign({
      sub: dto.id,
      email: dto.email,
      role: dto.role,
    });
  }
}
