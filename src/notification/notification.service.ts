import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class NotificationService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createNotification(userId: number, message: string) {
    
    return await this.databaseService.notification.create({
      data:{
        userId,
        message
      }
    })

  
  }

  async getNotificationsForUser(userId: number){
    return this.databaseService.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
