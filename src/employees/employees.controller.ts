import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { Prisma } from '@prisma/client';
import { Request } from 'express';
import { RolesGuard } from 'src/common/roles/role.guard';
import { Role } from 'src/common/roles/role.enum';
import { Roles } from 'src/common/roles/role.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { EventsGateway } from 'src/events/events.gateway';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Employees')
@Controller('employees')
@UseGuards(RolesGuard)
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService,
    private eventsgatewy : EventsGateway
  ) {}

  @Post()
  create(@Body() createEmployeeDto:Prisma.EmployeeCreateInput) {
     const emp = this.employeesService.create(createEmployeeDto);
     this.eventsgatewy.sendMessage(`Employee created: }`)
     return emp
  }

  @Roles(Role.ADMIN)
  @Get()
  @ApiOperation({ summary: 'Get all users' })
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
