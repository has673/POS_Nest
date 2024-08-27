import { IsString, IsOptional, IsInt, IsEnum, IsUrl } from 'class-validator';
import { Options } from '@prisma/client'; // Ensure that Options is imported from Prisma client

export class UpdateMenuItemDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @IsOptional()
  price: number;

  @IsOptional()
  photo?: string;

  @IsEnum(Options)
  @IsOptional()
  availability?: Options;

  @IsInt()
  @IsOptional()
  categoryId?: number;
}
