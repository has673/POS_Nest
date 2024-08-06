import { Module, NestModule , MiddlewareConsumer, RequestMethod} from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeesModule } from './employees/employees.module';
import { DatabaseModule } from './database/database.module';
import { CategoriesModule } from './categories/categories.module';
import { ItemsModule } from './items/items.module';
import { AuthModule } from './auth/auth.module';
 import { AuthMiddleware } from './common/middleware/auth.middleware';
// import { ReservationModule } from './reservation/reservation.module';
import { InventoryModule } from './inventory/inventory.module';
import { ReservatonModule } from './reservaton/reservaton.module';

@Module({
  imports: [EmployeesModule, DatabaseModule, CategoriesModule, ItemsModule, AuthModule, InventoryModule, ReservatonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
   configure(consumer: MiddlewareConsumer) {
     consumer.apply(AuthMiddleware).forRoutes(
     { path: 'employees', method: RequestMethod.ALL },)

 }
}
