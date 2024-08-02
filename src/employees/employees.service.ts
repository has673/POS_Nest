import { Injectable } from '@nestjs/common';

import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class EmployeesService {
  constructor(private readonly datbaseService:DatabaseService){}

 async  create(createEmployeeDto: Prisma.EmployeeCreateInput) {
    return this.datbaseService.employee.create({
      data:createEmployeeDto
    });
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
    return this.datbaseService.employee.update({
      where:{
        id,
      },data:updateEmployeeDto
    });
  }

  async remove(id: number) {
    return this.datbaseService.employee.delete({
      where:{
        id,
      }
    });
  }
}
