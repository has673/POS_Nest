import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { DatabaseService } from 'src/database/database.service';
import { v4 as uuidv4 } from 'uuid';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private readonly databaseService: DatabaseService) {}
  async create(createOrderDto: CreateOrderDto) {
    try {
      const { status, customerId, orderItems } = createOrderDto;
      let totalPrice = 0;

      // Start a transaction
      const orderNumber = uuidv4();
      return await this.databaseService.$transaction(async (prisma) => {
        // Create the order
        const order = await prisma.order.create({
          data: {
            orderNumber,
            status,
            customerId,
          },
        });

        // Create the order items
        for (const item of orderItems) {
          const menuItem = await prisma.menuItem.findFirst({
            where: { id: item.productId },
          });
          const itemTotalPrice = menuItem.price * item.quantity;
          totalPrice += itemTotalPrice;

          await prisma.orderItem.create({
            data: {
              quantity: item.quantity,
              price: menuItem.price,
              orderId: order.id,
              name: item.name,
              productId: item.productId,
            },
          });
        }

        await prisma.order.update({
          where: { id: order.id },
          data: { totalPrice },
        });

        // Return the created order along with its items
        return prisma.order.findUnique({
          where: { id: order.id },
          include: {
            orderItems: true,
          },
        });
      });
    } catch (err) {
      console.log(err);
    }
  }

  async findAll() {
    try {
      const order = await this.databaseService.order.findMany({
        include: {
          orderItems: true,
        },
      });
      return order;
    } catch (err) {
      console.log(err);
    }
  }

  async findOrders({ page = 1, limit = 10 }: { page: number; limit: number }) {
    const skip = (page - 1) * limit;
    return await this.databaseService.order.findMany({
      skip,
      take: limit,
    });
  }
  async findOne(id: number) {
    try {
      const order = await this.databaseService.order.findFirst({
        where: {
          id,
        },
      });
      if (!id) {
        console.log('order not found');
      }

      return order;
    } catch (err) {
      console.log(err);
    }
  }

  async remove(id: number) {
    try {
      // Use a transaction to ensure both deletions succeed or fail together
      const [deletedItems, deletedOrder] =
        await this.databaseService.$transaction([
          this.databaseService.orderItem.deleteMany({
            where: {
              orderId: id,
            },
          }),
          this.databaseService.order.delete({
            where: {
              id,
            },
          }),
        ]);

      return { message: 'Order and related items deleted successfully.' };
    } catch (error) {
      // Log and handle errors appropriately
      console.error(`Deletion failed: ${error.message}`);
      throw new Error(`Deletion failed: ${error.message}`);
    }
  }

  async filterOrders(status: OrderStatus) {
    try {
      if (!status) {
        throw new NotFoundException('Not found');
      }

      const orders = await this.databaseService.order.findMany({
        where: {
          status: status,
        },
        include: {
          orderItems: true,
        },
      });
      return orders;
    } catch (err) {
      console.log(err);
    }
  }

  // async update(id: number, updateOrderDto: UpdateOrderDto) {
  //   try {
  //     const order = await this.databaseService.order.findFirst({
  //       where: {
  //         id,
  //       },
  //     });
  //     if (!order) {
  //       throw new NotFoundException('Not found error');
  //     }
  //     const updatedOder = await this.databaseService.order.update({
  //       where: { id }, // Specify the user to update
  //       data: updateOrderDto,
  //     });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }
}
