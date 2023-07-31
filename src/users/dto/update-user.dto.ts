import {
  IsDefined,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

import { createUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(createUserDto) {
  @IsString()
  @IsDefined()
  @IsOptional()
  @IsNotEmpty({ message: 'username must not be empty!' })
  readonly username: string;

  @IsString()
  @IsDefined()
  @IsOptional()
  @IsNotEmpty({ message: 'fullname must not be empty!' })
  readonly fullName: string;

  @IsString()
  @IsDefined()
  @IsOptional()
  @IsNotEmpty({ message: 'address must not be empty!' })
  readonly address?: string;

  @IsString()
  @IsDefined()
  @IsOptional()
  @IsNotEmpty({ message: 'address must not be empty!' })
  readonly countryCode?: string;

  @IsString()
  @IsDefined()
  @IsOptional()
  @IsNotEmpty({ message: 'address must not be empty!' })
  @IsMobilePhone(null, {}, { message: 'Please provide a valid phonenumber!' })
  readonly phonenumber: string;
}
