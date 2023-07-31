import {
  Body,
  Controller,
  Get,
  Post,
  HttpException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { createUserDto } from 'src/users/dto/create-user.dto';
import { loginDto } from './dto/login.dto';

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
}
