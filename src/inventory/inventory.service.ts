import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class InventoryService {
  constructor(private readonly databaseService:DatabaseService){}
  create(createInventoryDto: Prisma.InventoryCreateInput) {
    return this.databaseService.inventory.create({
      data: createInventoryDto
   } );
  }

  findAll() {
    return this.databaseService.inventory.findMany();
  }

  findOne(id: number) {
    return this.databaseService.inventory.findFirst({
      where:{id}
    });
  }

  // update(id: number, updateInventoryDto: UpdateInventoryDto) {
  //   return `This action updates a #${id} inventory`;
  // }

  remove(id: number) {
    return this.databaseService.inventory.delete({
      where:{
        id
      }
    });
  }
}
