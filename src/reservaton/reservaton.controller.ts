import {
  Controller,
  Post,
  Body,
  ConflictException,
  InternalServerErrorException,
  Get,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
import { ReservatonService } from './reservaton.service';
import { CreateReservationWithCustomerDto } from './dto/create-reservation.dto';
import { CheckSlotAvailabilityDto } from './dto/check_availability.dto';
import { SkipThrottle } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

@ApiTags('Reservation')
@Controller('reservaton')
export class ReservatonController {
  constructor(private readonly reservatonService: ReservatonService) {}

  @Post()
  async createWithCustomer(
    @Body() createReservationWithCustomerDto: CreateReservationWithCustomerDto,
  ) {
    const { reservation } = createReservationWithCustomerDto;
    const { tableNumber, reservationDate, reservationTime, floor } =
      reservation;

    // Prepare details to check availability
    const checkSlotAvailabilityDto: CheckSlotAvailabilityDto = {
      tableNumber,
      floor,
      reservationDate,
      reservationTime,
    };

    // Check if the reservation slot is available
    const isAvailable = await this.reservatonService.findReservation(
      checkSlotAvailabilityDto,
    );

    if (!isAvailable) {
      throw new ConflictException(
        'The selected slot is already taken. Please choose a different time or table.',
      );
    }

    try {
      // Create reservation if slot is available
      const result = await this.reservatonService.createWithCustomer(
        createReservationWithCustomerDto,
      );
      return result;
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while creating the reservation.',
      );
    }
  }

  @SkipThrottle()
  @Get()
  async findAll() {
    return await this.reservatonService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const idNumber = parseInt(id, 10);

    return await this.reservatonService.findOne(idNumber);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() UpdateReservationDto: Prisma.ReservationUpdateInput,
  ) {
    const idNumber = parseInt(id, 10);
    return await this.reservatonService.update(idNumber, UpdateReservationDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const idNumber = parseInt(id, 10);
    return await this.reservatonService.remove(idNumber);
  }
}
