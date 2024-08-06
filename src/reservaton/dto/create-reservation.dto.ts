import { Type } from 'class-transformer';
import { ValidateNested, IsInt, IsString, IsDate, IsNotEmpty } from 'class-validator';

class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  emailAddress: string;
}

class CreateReservationDto {
  @IsInt()
  @IsNotEmpty()
  tableNumber: number;

  @IsString()
  @IsNotEmpty()
  paxNumber: string;

  @IsDate()
  @IsNotEmpty()
  reservationDate: Date;

  @IsNotEmpty()
  reservationTime: Date;


  @IsNotEmpty()
  depositFee: number;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsInt()
  @IsNotEmpty()
  floor: number;

  @IsString()
  @IsNotEmpty()
  paymentMethod: string;
}

export class CreateReservationWithCustomerDto {
  @ValidateNested()
  @Type(() => CreateCustomerDto)
  @IsNotEmpty()
  customer: CreateCustomerDto;

  @ValidateNested()
  @Type(() => CreateReservationDto)
  @IsNotEmpty()
  reservation: CreateReservationDto;
}
