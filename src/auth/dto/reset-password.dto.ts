import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsDefined()
  @IsNotEmpty({ message: 'email is required!' })
  readonly password: string;
}
