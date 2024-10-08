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
import { S3Module } from './s3/s3.module';
// import { S3Module } from './s3/s3.module';
import { StripeModule } from './stripe/stripe.module';
import { CustomerModule } from './customer/customer.module';
import { EventsModule } from './events/events.module';
// import { S3Module } from './s3/s3.module';

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
    S3Module,
    ThrottlerModule.forRoot([
      {
        ttl: 6000000,
        limit: 100,
      },
    ]),
    EventsModule,
    CustomerModule,
    StripeModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
}) //  tetsing
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      { path: 'employees', method: RequestMethod.GET },
      { path: 'categories', method: RequestMethod.GET },
      // { path: 'employees/:id', method: RequestMethod.GET },
      // { path: 'reservaton', method: RequestMethod.ALL },
      { path: 'reservaton/:id', method: RequestMethod.GET },
      { path: 'inventory', method: RequestMethod.ALL },
      { path: 'auth/:id/*', method: RequestMethod.PATCH },
      { path: 'auth/:id', method: RequestMethod.PUT },
      { path: 'auth/:id', method: RequestMethod.GET },
      { path: 'auth', method: RequestMethod.GET },
      { path: 'auth/userData/get', method: RequestMethod.GET },
    );
  }
}
