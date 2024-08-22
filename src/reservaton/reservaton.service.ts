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
      const existingCustomer = await this.findCustomer(emailAddress);
      if (!existingCustomer) {
        const newCustomer = await this.databaseService.customer.create({
          data: customer,
        });
      }

      const newReservation = await this.databaseService.reservation.create({
        data: {
          ...reservation,
          customerId: existingCustomer.id,
        },
      });

      return { existingCustomer, newReservation };
    } catch (err) {
      console.log(err);
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

  async update(id: number, UpdateReservationDto: UpdateReservationDto) {
    const res = await this.databaseService.reservation.update({
      where: {
        id,
      },
      data: UpdateReservationDto,
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
    return await this.databaseService.reservation.delete({
      where: { id },
    });
  }

  async findReservation(createReservationDto: CheckSlotAvailabilityDto) {
    const { tableNumber, reservationDate, reservationTime } =
      createReservationDto;

    const existingReservations =
      await this.databaseService.reservation.findMany({
        where: {
          tableNumber,
          reservationDate,
          reservationTime,
        },
      });

    return !existingReservations;
  }
}
