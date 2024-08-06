import { Controller, Post,Body,ConflictException, InternalServerErrorException, Get  } from '@nestjs/common';
import { ReservatonService } from './reservaton.service';
import { CreateReservationWithCustomerDto } from './dto/create-reservation.dto';
import { CheckSlotAvailabilityDto } from './dto/check_availability.dto';


@Controller('reservaton')
export class ReservatonController {
  constructor(private readonly reservatonService: ReservatonService) {}

  @Post()
 async  createWithCustomer(@Body() createReservationWithCustomerDto: CreateReservationWithCustomerDto) {
  const { reservation } = createReservationWithCustomerDto;
  const { tableNumber, reservationDate, reservationTime } = reservation;

  // Prepare details to check availability
  const checkSlotAvailabilityDto: CheckSlotAvailabilityDto = {
    tableNumber,
    reservationDate,
    reservationTime
  };

  // Check if the reservation slot is available
  const isAvailable = await this.reservatonService.findReservation(checkSlotAvailabilityDto);

  if (!isAvailable) {
    throw new ConflictException('The selected slot is already taken. Please choose a different time or table.');
   
  }

  try {
    // Create reservation if slot is available
    const result = await this.reservatonService.createWithCustomer(createReservationWithCustomerDto);
    return result;
  } catch (error) {
    throw new InternalServerErrorException('An error occurred while creating the reservation.');
  }
}

@Get()
async findAll(){
  return await this.reservatonService.findAll()
}

@Get(':id')
async findOne(id:number){
  return await this.reservatonService.findOne(id)
}
}
