// update-order-item.dto.ts
import { IsInt, IsOptional, IsNumber, Min } from 'class-validator';

export class UpdateOrderItemDto {

  
  @IsOptional()
  @IsInt()
  @Min(1) // Ensures quantity is a positive integer if provided
  quantity?: number;

  @IsOptional()
  @IsInt()
  productId?: number; // This references the MenuItem id

  @IsOptional()
  @IsNumber()
  @Min(0) // Ensures price is a non-negative number if provided
  price?: number; // Optional field for the price of the item (if needed)
}
