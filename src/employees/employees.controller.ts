import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { Prisma } from '@prisma/client';
import { Request } from 'express';
import { Role } from '../common/roles/role.enum';
import { Roles } from '../common/roles/role.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { EventsGateway } from '../events/events.gateway';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RolesGuard } from '../common/roles/role.guard';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('Employees')
@Controller('employees')
// @UseGuards(RolesGuard)
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

  
  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all users' })

  findAll(@Req() req:Request) {
 
    return this.employeesService.findAll();
  }

  
  @Get(':id')
  @Public()
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
