// create-item.dto.ts
import {
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsString,
} from 'class-validator';

import { Options } from '@prisma/client';

export class CreateItemDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  photo?: string;

  @IsNotEmpty()
  @IsEnum(Options) // Ensure this matches your Prisma enum
  availability: Options;

  @IsNotEmpty()
  @IsNumber()
  categoryId: number;
}
