import { Injectable } from '@nestjs/common';
import * as multer from 'multer';
import { DatabaseService } from '../database/database.service';
import { Prisma } from '@prisma/client';
import { Request } from 'express';
import { Express } from 'express';
import { EventsGateway } from '../events/events.gateway';
import { S3Service } from 'src/s3/s3.service';
import { AddAttendanceDto } from './dto/add-attendance.dto';
@Injectable()
export class EmployeesService {
  constructor(
    private readonly datbaseService: DatabaseService,
    private readonly eventsGateway: EventsGateway,
    private readonly s3Service: S3Service,
  ) {}

  //  async  create(createEmployeeDto: Prisma.EmployeeCreateInput) {

  //     const emp = this.datbaseService.employee.create({
  //       data:createEmployeeDto
  //     });
  //     this.eventsGateway.sendMessage(`Employee created: ${(await emp).Name}`);
  //     return emp
  //   }

  async create(
    createEmployeeDto: Prisma.EmployeeCreateInput,
    file?: Express.Multer.File,
  ) {
    try {
      if (file) {
        // Generate a unique key for the S3 bucket
        const bucketKey = `${file.fieldname}-${Date.now()}`;

        // Upload the file to S3 and get the file URL
        const fileUrl = await this.s3Service.uploadFile(file, bucketKey);

        // Include the file URL in the employee data
        createEmployeeDto.profilePicture = fileUrl;
      }

      const emp = await this.datbaseService.employee.create({
        data: createEmployeeDto,
      });

      this.eventsGateway.sendMessage(`Employee created: ${emp.Name}`);
      return emp;
    } catch (err) {
      console.log(err);
    }
  }

  async findAll() {
    return this.datbaseService.employee.findMany();
  }

  async findOne(id: number) {
    try {
      const emp = this.datbaseService.employee.findUnique({
        where: {
          id,
        },
      });

      if (!emp) {
        console.log('no employee found');
      }
      return emp;
    } catch (err) {
      console.log(err);
    }
  }

  async update(id: number, updateEmployeeDto: Prisma.EmployeeUpdateInput) {
    try {
      const emp = this.datbaseService.employee.update({
        where: {
          id,
        },
        data: updateEmployeeDto,
      });
      this.eventsGateway.sendMessage(`Employee updated: ${(await emp).Name}`);
      return emp;
    } catch (err) {
      console.log(err);
    }
  }

  async remove(id: number) {
    try {
      const emp = this.datbaseService.employee.delete({
        where: {
          id,
        },
      });
      this.eventsGateway.sendMessage(`Employee deleted: ${(await emp).Name}`);
      if (!emp) {
        console.log('employee not found');
      }
      return emp;
    } catch (err) {
      console.log(err);
    }
  }
  async attendance(id: number, addAttendanceDto: AddAttendanceDto) {
    try {
      const { status, date } = addAttendanceDto;
      const attendanceDate = date || new Date();
      const attendance = await this.datbaseService.attendance.create({
        data: {
          employeeId: id,
          status,
          date: attendanceDate,
        },
      });
      return attendance;
    } catch (err) {
      console.log(err);
    }
  }

  async findAttendance() {
    try {
      const currentDate = new Date();
      // Set the time to midnight to ensure we get attendances for the whole day
      currentDate.setHours(0, 0, 0, 0);

      const employees = await this.datbaseService.employee.findMany({
        select: {
          id: true,
          Name: true,
          attendances: {
            where: {
              date: {
                gte: currentDate, // Attendances on or after the start of the current day
                lt: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000), // Attendances before the end of the current day
              },
            },
          },
        },
      });

      return employees;
    } catch (err) {
      console.log(err);
    }
  }
}
