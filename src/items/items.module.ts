import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { DatabaseModule } from 'src/database/database.module';
import { S3Module } from 'src/s3/s3.module';

@Module({
  imports: [DatabaseModule, S3Module],
  controllers: [ItemsController],
  providers: [ItemsService],
})
export class ItemsModule {}
