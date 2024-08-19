import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { DatabaseModule } from '../database/database.module';
import { EventsModule } from '../events/events.module';
import { S3Module } from 'src/s3/s3.module';

@Module({
  imports:[DatabaseModule, EventsModule,S3Module],
  controllers: [EmployeesController],
  providers: [EmployeesService],
})
export class EmployeesModule {}
