import { Injectable } from '@nestjs/common';
// import { CreateItemDto } from './dto/create-item.dto';
// import { UpdateItemDto } from './dto/update-item.dto';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ItemsService {
  constructor(private readonly datbaseService:DatabaseService){}

 async  create(createItemDto: Prisma.MenuItemCreateInput) {
     return this.datbaseService.menuItem.create({
      data:createItemDto
     });
  }

  findAll() {
    return this.datbaseService.menuItem.findMany();
  }

  findOne(id: number) {
    return this.datbaseService.menuItem.findFirst({
      where:{
        id,
      }
    });
  }

  update(id: number, updateItemDto: Prisma.MenuItemUpdateInput) {
    return this.datbaseService.menuItem.update({
      where:{
        id,
      },data:updateItemDto
    });
  }

  remove(id: number) {
    return this.datbaseService.menuItem.delete({
      where:{
        id,
      }
    });
  }
}
