import { IsInt, IsDate, IsNotEmpty } from 'class-validator';

export class CheckSlotAvailabilityDto {
  @IsInt()
  @IsNotEmpty()
  tableNumber: number;

  @IsDate()
  @IsNotEmpty()
  reservationDate: Date;

  @IsDate()
  @IsNotEmpty()
  reservationTime: Date;
}
