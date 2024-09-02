// create-order.dto.ts
import {
  IsEnum,
  IsInt,
  IsString,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderItemDto } from './create-order-item.dto';
import { UpdateOrderItemDto } from './update-order-item.dto';

// Enums defined within the same file
export enum OrderStatus {
  IN_PROCESS = 'IN_PROCESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  READY = 'READY',
}

export class UpdateOrderDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  // @IsOptional()
  // @IsInt()
  // customerId?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateOrderItemDto)
  orderItems: UpdateOrderItemDto[];
}
