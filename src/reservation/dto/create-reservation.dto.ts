// create-reservation.dto.ts
import { IsNotEmpty, IsInt, IsString, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCustomerDto } from './create-customer.dto';

export class CreateReservationDto {
  @IsNotEmpty()
  @IsInt()
  tableNumber: number;

  @IsNotEmpty()
  @IsString()
  paxNumber: string;

  @IsNotEmpty()
  @IsDateString()
  reservationDate: Date;

  @IsNotEmpty()
  @IsDateString()
  reservationTime: Date;

  @IsNotEmpty()
  depositFee: number;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsNotEmpty()
  @IsInt()
  floor: number;

  @IsNotEmpty()
  @IsString()
  paymentMethod: string;

  @IsNotEmpty()
  @Type(() => CreateCustomerDto)
  customer: CreateCustomerDto;
}
