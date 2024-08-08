import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards} from '@nestjs/common';
import { EmployeesService } from './employees.service';

import { Prisma } from '@prisma/client';
import { Request } from 'express';
import { RolesGuard } from 'src/common/roles/role.guard';
import { Role } from 'src/common/roles/role.enum';
import { Roles } from 'src/common/roles/role.decorator';

@Controller('employees')
@UseGuards(RolesGuard)
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  create(@Body() createEmployeeDto:Prisma.EmployeeCreateInput) {
    return this.employeesService.create(createEmployeeDto);
  }

  @Roles(Role.ADMIN)
  @Get()
  findAll(@Req() req:Request) {
 
    return this.employeesService.findAll();
  }

  @Roles(Role.SUBADMIN)
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
