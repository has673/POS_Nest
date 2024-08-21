import { Injectable } from '@nestjs/common';
// import { CreateItemDto } from './dto/create-item.dto';
// import { UpdateItemDto } from './dto/update-item.dto';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';
import { S3Service } from 'src/s3/s3.service';

@Injectable()
export class ItemsService {
  constructor(
    private readonly datbaseService: DatabaseService,
    private readonly s3Service: S3Service,
  ) {}

  async create(
    createItemDto: Prisma.MenuItemCreateInput,
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
      createItemDto.photo = fileUrl;
    }
    return this.datbaseService.menuItem.create({
      data: createItemDto,
    });
  }

  findAll() {
    return this.datbaseService.menuItem.findMany();
  }

  findOne(id: number) {
    return this.datbaseService.menuItem.findFirst({
      where: {
        id,
      },
    });
  }

  async update(
    id: number,
    updateItemDto: Prisma.MenuItemUpdateInput,
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

    return this.datbaseService.menuItem.update({
      where: {
        id,
      },
      data: updateItemDto,
    });
  }

  remove(id: number) {
    return this.datbaseService.menuItem.delete({
      where: {
        id,
      },
    });
  }
}
