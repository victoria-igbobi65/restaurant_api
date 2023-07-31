import { IsDefined, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class GoogleOauthDto {
  @IsString()
  @IsDefined()
  @IsNotEmpty({ message: 'Fullname is required!' })
  readonly fullName: string;

  @IsString()
  @IsDefined()
  @IsEmail({}, { message: 'Please provide a valid email address!' })
  readonly email: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty({ message: 'username is required!' })
  readonly username: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty({ message: 'googleId is required!' })
  readonly googleId: string;
}
