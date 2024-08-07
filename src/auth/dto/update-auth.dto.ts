import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthDto } from './create-auth.dto';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
export class UpdateAuthDto extends PartialType(CreateAuthDto) {
 
@IsString()
@IsOptional()
  readonly username: string;
 
  @IsOptional()
  @IsEmail()
  readonly email: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  readonly password: string;

  @IsOptional()
  readonly profile:string
    
}
