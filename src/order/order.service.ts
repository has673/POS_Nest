import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class OrderService {
  constructor(private readonly databaseService:DatabaseService){}
  create(createOrderDto: CreateOrderDto) {
    return 'This action adds a new order';
  }

 async  findAll() {
    return await this.databaseService.order.findMany() ;
  }

 async  findOne(id: number) {
    return await this.databaseService.order.findFirst({
      where:{
        id
      }
    });
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  async remove(id: number) {
    return await this.databaseService.order.delete({
      where:{
        id
      }
    });
  }
}
