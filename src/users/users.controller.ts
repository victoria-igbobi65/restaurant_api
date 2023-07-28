import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';

import { UsersService } from './users.service';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { User } from './models/user.model';

@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadProfilePic(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: User,
  ) {
    return this.usersService.uploadProfilePic(file, user.email);
  }
}
