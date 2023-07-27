import { Body, Controller, Post, HttpException } from '@nestjs/common';

import { AuthService } from './auth.service';
import { createUserDto } from './dto/create-user.dto';
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
}
