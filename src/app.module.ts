import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeesModule } from './employees/employees.module';
import { DatabaseModule } from './database/database.module';
import { CategoriesModule } from './categories/categories.module';
import { ItemsModule } from './items/items.module';

@Module({
  imports: [EmployeesModule, DatabaseModule, CategoriesModule, ItemsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
