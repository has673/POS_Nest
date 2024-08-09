import { Injectable } from '@nestjs/common';
import * as multer from 'multer';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';
import { Request } from 'express';
import { EventsGateway } from 'src/events/events.gateway';


@Injectable()
export class EmployeesService {
  constructor(
    private readonly datbaseService:DatabaseService,
    private readonly eventsGateway: EventsGateway
 
  ){}


 async  create(createEmployeeDto: Prisma.EmployeeCreateInput) {
 
    const emp = this.datbaseService.employee.create({
      data:createEmployeeDto
    });
    this.eventsGateway.sendMessage(`Employee created: ${(await emp).Name}`);
    return emp
  }

  async findAll() {
    return this.datbaseService.employee.findMany();
  }

 async  findOne(id: number) {
    return this.datbaseService.employee.findUnique({
      where:{
        id,

      }
    
    });
  }

  async update(id: number, updateEmployeeDto: Prisma.EmployeeUpdateInput) {
     const emp = this.datbaseService.employee.update({
      where:{
        id,
      },data:updateEmployeeDto
    });
    this.eventsGateway.sendMessage(`Employee updated: ${(await emp).Name}`);
    return emp
  }

  async remove(id: number) {
     const emp =  this.datbaseService.employee.delete({
      where:{
        id,
      }
    });
    this.eventsGateway.sendMessage(`Employee deleted: ${(await emp).Name}`);
    return emp
  }
}
