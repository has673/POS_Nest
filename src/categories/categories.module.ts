import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { DatabaseModule } from 'src/database/database.module';
import { S3Module } from 'src/s3/s3.module';

@Module({
  imports: [DatabaseModule, S3Module],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
