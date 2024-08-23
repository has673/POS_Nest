import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { CreateReservationWithCustomerDto } from './dto/create-reservation.dto';
import { CheckSlotAvailabilityDto } from './dto/check_availability.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
@Injectable()
export class ReservatonService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createWithCustomer(
    createReservationWithCustomerDto: CreateReservationWithCustomerDto,
  ) {
    try {
      const { customer, reservation } = createReservationWithCustomerDto;
      const { emailAddress } = customer;

      // Check if the customer already exists
      let existingCustomer = await this.findCustomer(emailAddress);

      // If the customer doesn't exist, create a new one
      if (!existingCustomer) {
        existingCustomer = await this.databaseService.customer.create({
          data: customer,
        });
      }

      // Create the reservation with the customer's ID
      const newReservation = await this.databaseService.reservation.create({
        data: {
          ...reservation,
          customerId: existingCustomer.id, // Assign the customerId here
        },
      });

      return { customer: existingCustomer, reservation: newReservation };
    } catch (err) {
      console.error(err);
      throw new Error('Failed to create reservation with customer');
    }
  }

  async findAll() {
    return await this.databaseService.reservation.findMany();
  }

  async findCustomer(emailAddress: string) {
    return await this.databaseService.customer.findFirst({
      where: { emailAddress },
    });
  }

  async update(
    id: number,
    updateReservationDto: Prisma.ReservationUpdateInput,
  ) {
    const res = await this.databaseService.reservation.update({
      where: {
        id,
      },
      data: updateReservationDto,
    });
    return res;
  }

  async findOne(id: number) {
    try {
      const reservation = await this.databaseService.reservation.findFirst({
        where: {
          id,
        },
      });
      if (!reservation) {
        throw new NotFoundException('reservation not found ', {
          cause: new Error(),
          description: 'Some error description',
        });
      }
      return reservation;
    } catch (err) {
      console.log(err);
    }
  }

  async remove(id: number) {
    try {
      const reservation = await this.databaseService.reservation.delete({
        where: { id },
      });
      if (!reservation) {
        console.log('reservation no found');
      }
    } catch (err) {
      console.log(err);
    }
  }

  async findReservation(createReservationDto: CheckSlotAvailabilityDto) {
    const { tableNumber, reservationDate, reservationTime, floor } =
      createReservationDto;

    const existingReservations =
      await this.databaseService.reservation.findFirst({
        where: {
          floor,
          tableNumber,
          reservationDate,
          reservationTime,
        },
      });

    return !existingReservations;
  }
}
