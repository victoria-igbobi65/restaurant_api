import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { UsersService } from './users.service';

@Controller('user')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadProfilePic(@UploadedFile() file: Express.Multer.File) {
    return file;
  }
}
