import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { EmployeesService } from './employees.service';

import { Prisma } from '@prisma/client';
import { Request } from 'express';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  create(@Body() createEmployeeDto:Prisma.EmployeeCreateInput) {
    return this.employeesService.create(createEmployeeDto);
  }

  @Get()
  findAll(@Req() req:Request) {
    console.log(req['user'])
    return this.employeesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Req() req:Request, @Body() updateEmployeeDto: Prisma.EmployeeUpdateInput) {
    console.log(req['user'])
    return this.employeesService.update(+id, updateEmployeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeesService.remove(+id);
  }
}
