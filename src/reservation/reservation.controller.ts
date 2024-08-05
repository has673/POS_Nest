import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Prisma } from '@prisma/client';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @Post()
  async create(@Body() createReservationDto: CreateReservationDto) {
  

    // Validate reservation data
   

    // try {
    //     // Check if the customer already exists
    //     const existingCustomer = await this.reservationService.findCustomerByEmail(customer.emailAddress);
    //     let customerId;

    //     if (!existingCustomer) {
    //         // Add new customer if not exists
    //         const newCustomer = await this.reservationService.addCustomer(customer);
    //         console.info(newCustomer);
    //         customerId = newCustomer.id;
    //     } else {
    //         customerId = existingCustomer.id;
    //     }

        // Check if the reservation already exists
        const existingReservation = await this.reservationService.findReservation(
        createReservationDto.tableNumber,
        createReservationDto.reservationDate,
        createReservationDto.reservationTime,
        );
        console.info(existingReservation)

        // Create the reservation
        const newReservation = await this.reservationService.addReservation({
            ...reservation,
            customerId,
        });

        return newReservation;
    } catch (err) {
        console.error(err);
       
    }
  }

  @Get()
  findAll() {
    return this.reservationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReservationDto: UpdateReservationDto) {
    return this.reservationService.update(+id, updateReservationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservationService.remove(+id);
  }
}
