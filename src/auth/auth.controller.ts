import {
  Body,
  Controller,
  Get,
  Post,
  HttpException,
  Query,
  Req,
  Res,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response, Request } from 'express';

import { AuthService } from './auth.service';
import { createUserDto } from 'src/users/dto/create-user.dto';
import { loginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: createUserDto) {
    return this.authService.register(dto);
  }

  @Post('signin')
  signin(@Body() dto: loginDto) {
    if (!dto.email && !dto.phonenumber)
      throw new HttpException('email or phonenumber is required!', 400);
    return this.authService.login(dto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    //console.log();
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthCallback(@Req() req: any) {
    return this.authService.googleOauthSignIn(req.user);
  }

  @Post('forgotPassword')
  async forgotPassword(
    @Body() dto: ForgotPasswordDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const baseURL = `${req.protocol}://${req.get('host')}`;
    await this.authService.forgotPassword(dto.email, baseURL);
    res.status(200).json({ message: 'Token sent to mail!' });
  }

  @Patch('resetPassword')
  async resetPassword(
    @Body() dto: ResetPasswordDto,
    @Query('token') token: string,
  ) {
    return await this.authService.resetpassword(token, dto.password);
  }
}
