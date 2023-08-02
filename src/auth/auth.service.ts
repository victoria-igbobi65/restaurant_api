import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { User } from 'src/users/models/user.model';
import { createUserDto } from 'src/users/dto/create-user.dto';
import { E_INCORRECT_CREDENTIALS } from 'src/common/constants/constants.text';
import {
  SIGNUP_EMAIL_SUBJECT,
  SIGNUP_EMAIL_TEMPLATE,
} from 'src/common/constants/email-config.text';
import { loginDto } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';
import { GoogleOauthDto } from './dto/google-oauth.dto';
import { MailService } from 'src/common/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async register(dto: createUserDto) {
    const user = await this.usersService.createUser(dto);
    const token = await this.signToken(user);

    await this.mailService.sendEmail(
      user.email,
      SIGNUP_EMAIL_SUBJECT,
      SIGNUP_EMAIL_TEMPLATE,
      { name: user.username },
    );
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

  async googleOauthSignIn(dto: GoogleOauthDto) {
    let user = await this.usersService.findUserByGoogleId(dto.googleId);
    let token: string;

    // condition if user has either signed up with gooogle or performed account linking
    if (user) {
      token = await this.signToken(user);
      return { user, token };
    }

    user = await this.usersService.findUserByEmail(dto.email);
    // condition if user has signed up manually before
    if (user) {
      user.googleId = dto.googleId; // Perform account linking for user
      await user.save();
      token = await this.signToken(user);
      return { user, token };
    }

    // if all conditions is false, save their google details to the db
    user = await this.usersService.GoogleOauthCreateUser(dto);
    token = await this.signToken(user);
    await this.mailService.sendEmail(
      user.email,
      SIGNUP_EMAIL_SUBJECT,
      SIGNUP_EMAIL_TEMPLATE,
      { name: user.username },
    );
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
