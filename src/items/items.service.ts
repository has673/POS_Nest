import { Injectable, NotFoundException } from '@nestjs/common';
// import { CreateItemDto } from './dto/create-item.dto';
// import { UpdateItemDto } from './dto/update-item.dto';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';
import { S3Service } from 'src/s3/s3.service';
import { UpdateMenuItemDto } from './dto/update-item.dto';
import { CreateItemDto } from './dto/create-item.dto';

@Injectable()
export class ItemsService {
  constructor(
    private readonly datbaseService: DatabaseService,
    private readonly s3Service: S3Service,
  ) {}

  async create(createItemDto: CreateItemDto, file?: Express.Multer.File) {
    if (!file) {
      console.debug('No file uploaded');
    } else {
      console.debug('File detected:', file);
    }

    if (file) {
      // Generate a unique key for the S3 bucket
      const bucketKey = `${file.fieldname}-${Date.now()}`;

      // Upload the file to S3 and get the file URL
      const fileUrl = await this.s3Service.uploadFile(file, bucketKey);

      // Add the file URL to the DTO
      createItemDto.photo = fileUrl;
    }

    return this.datbaseService.menuItem.create({
      data: createItemDto,
    });
  }

  findAll() {
    return this.datbaseService.menuItem.findMany();
  }

  async findOne(id: number) {
    try {
      const item = await this.datbaseService.menuItem.findFirst({
        where: {
          id,
        },
      });
      if (!item) {
        console.log('item not found');
      }
      return item;
    } catch (err) {
      console.log(err);
    }
  }

  async getCount(): Promise<number> {
    try {
      const count = await this.datbaseService.menuItem.count();
      return count;
    } catch (err) {
      console.log(err);
    }
  }

  async update(
    id: number,
    updateItemDto: UpdateMenuItemDto,
    file?: Express.Multer.File,
  ) {
    if (!file) {
      console.debug('No file uploaded');
    } else {
      console.debug('File detected:', file);
    }

    if (file) {
      // Generate a unique key for the S3 bucket
      const bucketKey = `${file.fieldname}-${Date.now()}`;

      // Upload the file to S3 and get the file URL
      const fileUrl = await this.s3Service.uploadFile(file, bucketKey);

      // Add the file URL to the DTO
      updateItemDto.photo = fileUrl;
    }
    try {
      const item = this.datbaseService.menuItem.update({
        where: {
          id,
        },
        data: updateItemDto,
      });
      console.log('update item');
      return item;
    } catch (err) {
      console.log(err);
    }
  }

  async remove(id: number) {
    try {
      const item = await this.datbaseService.menuItem.delete({
        where: {
          id,
        },
      });
      if (!item) {
        console.log('item not found');
      }
    } catch (err) {
      console.log(err);
    }
  }
}
