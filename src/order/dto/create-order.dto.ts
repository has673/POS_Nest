// create-order.dto.ts
import { IsEnum, IsInt, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderItemDto } from './create-order-item.dto';

// Enums defined within the same file
export enum OrderStatus {
  IN_PROCESS = 'IN_PROCESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  READY = 'READY',
}

export class CreateOrderDto {
  @IsString()
  orderNumber: string;

  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsInt()
  customerId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  orderItems: CreateOrderItemDto[];
}
