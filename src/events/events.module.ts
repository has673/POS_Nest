import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { NotificationService } from 'src/notification/notification.service';
import { DatabaseService } from 'src/database/database.service';

@Module({
  providers: [EventsGateway, NotificationService, DatabaseService],
  exports:[EventsGateway],
})
export class EventsModule {}
