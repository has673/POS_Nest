import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeesModule } from './employees/employees.module';
import { DatabaseModule } from './database/database.module';
import { CategoriesModule } from './categories/categories.module';
import { ItemsModule } from './items/items.module';
import { AuthModule } from './auth/auth.module';
import { ReservationModule } from './reservation/reservation.module';

@Module({
  imports: [EmployeesModule, DatabaseModule, CategoriesModule, ItemsModule, AuthModule, ReservationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
