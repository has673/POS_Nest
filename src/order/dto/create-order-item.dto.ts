// create-order-item.dto.ts
import { IsInt, IsNumber } from 'class-validator';

export class CreateOrderItemDto {
  @IsInt()
  quantity: number;



  @IsInt()
  productId: number; // This references the MenuItem id
}
