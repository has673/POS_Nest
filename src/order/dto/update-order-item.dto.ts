// create-order-item.dto.ts
import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateOrderItemDto {
  @IsInt()
  quantity: number;

  @IsNotEmpty()
  name: string;

  @IsInt()
  productId: number; // This references the MenuItem id
}
