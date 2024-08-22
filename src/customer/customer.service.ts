import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class CustomerService {
  constructor(private readonly databaseService: DatabaseService) {}
  create(createCustomerDto: CreateCustomerDto) {
    return 'This action adds a new customer';
  }

  findAll() {
    return `This action returns all customer`;
  }

  async findOne(id: number) {
    try {
      const customer = await this.databaseService.customer.findFirst({
        where: {
          id,
        },
      });
      if (!customer) {
        throw new NotFoundException('customer not found ', {
          cause: new Error(),
          description: 'Some error description',
        });
      }
      return customer;
    } catch (err) {
      console.log(err);
    }
  }

  update(id: number, updateCustomerDto: UpdateCustomerDto) {
    return `This action updates a #${id} customer`;
  }

  remove(id: number) {
    return `This action removes a #${id} customer`;
  }
}
