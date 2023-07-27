import {
  IsDefined,
  IsString,
  IsNotEmpty,
  IsEmail,
  IsMobilePhone,
  IsEnum,
  IsOptional,
} from 'class-validator';

import { Gender } from 'src/common/constants/enums';

export class createUserDto {
  @IsString()
  @IsDefined()
  @IsNotEmpty({ message: 'Fullname is required!' })
  readonly fullName: string;

  @IsEmail()
  @IsString()
  @IsDefined()
  @IsNotEmpty({ message: 'Email is required!' })
  readonly email: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty({ message: 'countryCode is required' })
  readonly countryCode: string;

  @IsNotEmpty({ message: 'Phonenumber is required' })
  @IsMobilePhone(null, {}, { message: 'Please Provide a valid phonenumber' })
  readonly phonenumber: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty({ message: 'Username is required!' })
  readonly username: string;

  @IsString()
  @IsEnum(Gender, { message: `Expected values ['male', 'female', 'others']` })
  @IsNotEmpty({ message: 'Gender is required!' })
  readonly gender: Gender;

  @IsString()
  @IsOptional()
  readonly address?: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty({ message: 'password is required!' })
  password: string;
}
