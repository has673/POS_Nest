import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';

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
import { OrderModule } from './order/order.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { Exclude } from 'class-transformer';
import { RolesGuard } from './common/roles/role.guard';


@Module({
  imports: [
    EmployeesModule,
    DatabaseModule,
    CategoriesModule,
    ItemsModule,
    AuthModule,
    InventoryModule,
    ReservatonModule,
    OrderModule,
    ThrottlerModule.forRoot([
      {
        ttl: 600000,
        limit: 100,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard   },
      {
        provide: APP_GUARD,
        useClass: RolesGuard   },
  ],
})//  tetsing
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'employees', method: RequestMethod.ALL },
        { path: 'employees/:id', method: RequestMethod.ALL },
        { path: 'reservaton', method: RequestMethod.ALL },
        { path: 'reservaton/:id', method: RequestMethod.ALL },
        { path: 'inventory', method: RequestMethod.ALL },
        // { path: 'auth/:id', method: RequestMethod.GET },
      );
  }
}
