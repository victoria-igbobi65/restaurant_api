import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsDefined()
  @IsNotEmpty({ message: 'category is required!' })
  readonly name: string;
}
