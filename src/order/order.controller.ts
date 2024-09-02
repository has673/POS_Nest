import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus } from '@prisma/client';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get('page')
  getOrders(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.orderService.findOrders({ page, limit });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const orderId = parseInt(id);
    return this.orderService.findOne(+orderId);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
  //   return this.orderService.update(+id, updateOrderDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const orderId = parseInt(id);
    return this.orderService.remove(+orderId);
  }

  @Get('filter/status')
  async filterOrders(@Query('status') status: OrderStatus) {
    return this.orderService.filterOrders(status);
  }
}
