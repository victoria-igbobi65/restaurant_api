import {
  IsDefined,
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class loginDto {
  @IsString()
  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address!' })
  @IsNotEmpty({ message: 'please provide an email address!' })
  readonly email: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty({ message: 'Mobile number is required!' })
  @IsMobilePhone(null, {}, { message: 'Please provide a valid phone number' })
  readonly phonenumber: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty({ message: 'password is required!' })
  readonly password: string;
}
