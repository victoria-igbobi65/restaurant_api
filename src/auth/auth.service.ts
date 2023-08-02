import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';

import { User } from 'src/users/models/user.model';
import { createUserDto } from 'src/users/dto/create-user.dto';
import {
  E_INCORRECT_CREDENTIALS,
  E_INVALID_TOKEN,
  E_USER_NOT_EXISTS,
} from 'src/common/constants/constants.text';
import {
  PASSWORD_RESET_SUBJECT,
  PASSWORD_RESET_TEMPLATE,
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

    // send welcome email to users
    await this.mailService.sendEmail(
      user.email,
      SIGNUP_EMAIL_SUBJECT,
      SIGNUP_EMAIL_TEMPLATE,
      { name: user.username },
    );
    return { user, token };
  }

  async login(dto: loginDto) {
    const { email, phonenumber, password } = dto;
    const user = await this.usersService.findUserByCredentials({
      $or: [{ email }, { phonenumber }],
    });
    if (!user || !(await user?.validatePassword(password))) {
      throw new HttpException(E_INCORRECT_CREDENTIALS, 400);
    }
    const token = await this.signToken(user); // sign user token
    user.password = undefined; // delete user password from return body.
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

  async forgotPassword(email: string, baseURL: string) {
    const user = await this.usersService.findUserByEmail(email); // find user by provided email
    if (!user) throw new HttpException(E_USER_NOT_EXISTS, 404);

    const resetToken = user.createResetPasswordToken(); // create a hashed reset token for user
    await user.save({ validateBeforeSave: false }); // save the token to the user document
    const resetLink = `${baseURL}/auth/resetPassword?token=${resetToken}`; // generate reset URL for user

    await this.mailService.sendEmail(
      email,
      PASSWORD_RESET_SUBJECT,
      PASSWORD_RESET_TEMPLATE,
      { username: user.username, resetLink },
    );
    return;
  }

  async resetpassword(Token: string, password: string) {
    const hashedToken = crypto.createHash('sha256').update(Token).digest('hex');
    const user = await this.usersService.findUserByCredentials({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) throw new HttpException(E_INVALID_TOKEN, 400);

    user.password = password; // save new user password
    user.passwordResetToken = undefined; // Delete saved hashed token from user document
    user.passwordResetExpires = undefined; // Remove reset token expiry time
    await user.save(); // update document to reflect changes
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
