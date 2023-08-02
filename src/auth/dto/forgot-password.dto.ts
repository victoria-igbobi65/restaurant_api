import { IsDefined, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ForgotPasswordDto {
  @IsString()
  @IsDefined()
  @IsNotEmpty({ message: 'email is required!' })
  @IsEmail({}, { message: 'Please provide a valid email!' })
  readonly email: string;
}
