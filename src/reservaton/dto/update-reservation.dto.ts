import { Type } from 'class-transformer';
import {
  ValidateNested,
  IsInt,
  IsString,
  IsDate,
  IsOptional,
} from 'class-validator';

// // Customer DTO for updating
// class UpdateCustomerDto {
//   @IsString()
//   @IsOptional()
//   title?: string;

//   @IsString()
//   @IsOptional()
//   fullName?: string;

//   @IsString()
//   @IsOptional()
//   phoneNumber?: string;

//   @IsString()
//   @IsOptional()
//   emailAddress?: string;
//}

// Reservation DTO for updating
export class UpdateReservationDto {
  @IsInt()
  @IsOptional()
  tableNumber?: number;

  @IsOptional()
  paxNumber?: number;

  @IsDate()
  @IsOptional()
  reservationDate?: Date;

  @IsDate()
  @IsOptional()
  reservationTime?: Date;

  @IsOptional()
  depositFee?: number;

  @IsString()
  @IsOptional()
  status?: string;

  @IsInt()
  @IsOptional()
  floor?: number;

  @IsString()
  @IsOptional()
  paymentMethod?: string;
}

// Combined DTO for updating with customer and reservation
// export class UpdateReservationWithCustomerDto {
//   @ValidateNested()
//   @Type(() => UpdateCustomerDto)
//   @IsOptional()
//   customer?: UpdateCustomerDto;

//   @ValidateNested()
//   @Type(() => UpdateReservationDto)
//   @IsOptional()
//   reservation?: UpdateReservationDto;
// }
