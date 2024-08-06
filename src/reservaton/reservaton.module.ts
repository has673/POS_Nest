import { Module } from '@nestjs/common';
import { ReservatonService } from './reservaton.service';
import { ReservatonController } from './reservaton.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports:[DatabaseModule],
  controllers: [ReservatonController],
  providers: [ReservatonService],
})
export class ReservatonModule {}
