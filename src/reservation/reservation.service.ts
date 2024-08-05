import { Injectable } from '@nestjs/common';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';
import { CreateCustomerDto, CreateReservationDto } from './dto/create-reservation.dto';

@Injectable()
export class ReservationService {
  constructor(private readonly databaseService:DatabaseService){}
  // create(createReservationDto:Prisma.ReservationCreateInput ) {
  //   return this.databaseService.reservation.create({
  //     data:createReservationDto})
   
  // }
  // createcustomer(createCustomerDto:Prisma.CustomerCreateInput){
  //   return this.databaseService.customer.create({
  //     data:createCustomerDto
  //   })
  // }



  async findCustomerByEmail(emailAddress: string) {
    return this.databaseService.customer.findFirst({
      where: { emailAddress },
    });
  }

  async addCustomer(customer: CreateCustomerDto) {
    return this.databaseService.customer.create({
      data: customer,
    });

  }
  async findReservation(tableNumber: number, reservationDate: string, reservationTime: string) {
    return this.databaseService.reservation.findFirst({
      where: {
        tableNumber,
        reservationDate,
        reservationTime,
      },
    });
  }

  async addReservation(reservation: CreateReservationDto) {
    return this.databaseService.reservation.create({
      data: {
        reservation
      },
    });
  }
  findAll() {
    return this.databaseService.reservation.findMany();
  }

  findOne(id: number) {
    return this.databaseService.reservation.findFirst({
      where:{
        id
      }
    });
  }

  // update(id: number, updateReservationDto: UpdateReservationDto) {
  //   return `This action updates a #${id} reservation`;
  // }

  remove(id: number) {
    return this.databaseService.reservation.delete({
      where:{
        id
      }
    });
  }
}
