import { Type } from 'class-transformer';
import { IsInt, IsString, IsDate, IsNotEmpty } from 'class-validator';
export class UpdateReservationDto{

  @IsInt()
  @IsNotEmpty()
  tableNumber: number;
    
  @IsDate()
  @IsNotEmpty()
  reservationDate: Date;

  @IsDate()
  @IsNotEmpty()
  reservationDTime: Date;



  

  
}