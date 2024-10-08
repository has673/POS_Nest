import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
export class CreateAuthDto {
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  readonly password: string;

  @IsOptional()
  readonly profile:string
}
