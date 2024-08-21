import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';
import { S3Service } from 'src/s3/s3.service';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly datbaseService: DatabaseService,
    private readonly s3Service: S3Service,
  ) {}
  async create(
    createCategoryDto: Prisma.CategoryCreateInput,
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
      createCategoryDto.icon = fileUrl;
    }
    try {
      const category = this.datbaseService.category.create({
        data: createCategoryDto,
      });
      return category;
    } catch (err) {
      console.log(err);
    }
  }

  findAll() {
    return this.datbaseService.category.findMany();
  }

  findOne(id: number) {
    return this.datbaseService.category.findFirst({
      where: {
        id,
      },
    });
  }

  async update(
    id: number,
    updateCategoryDto: Prisma.CategoryUpdateInput,
    file?: Express.Multer.File,
  ) {
    console.debug('update');

    if (!file) {
      console.debug('No file uploaded');
    } else {
      console.debug('File detected:', file);
    }

    if (file) {
      const bucketKey = `${file.fieldname}-${Date.now()}`;
      console.log('Uploading file to S3 with key:', bucketKey);

      try {
        const fileUrl = await this.s3Service.uploadFile(file, bucketKey);
        console.log('File uploaded successfully, URL:', fileUrl);

        updateCategoryDto.icon = fileUrl;
        console.log(updateCategoryDto);
      } catch (uploadError) {
        console.error('Error uploading file:', uploadError);
        throw new Error('Failed to upload file');
      }
    }

    try {
      return await this.datbaseService.category.update({
        where: {
          id,
        },
        data: updateCategoryDto,
      });
    } catch (err) {
      console.error('Error updating category:', err);
      throw new Error('Failed to update category');
    }
  }

  remove(id: number) {
    return this.datbaseService.category.delete({
      where: {
        id,
      },
    });
  }

  async findmenu(id: number) {
    const category = await this.datbaseService.category.findFirst({
      where: {
        id,
      },
      include: {
        menuItems: true,
      },
    });
    return category ? category.menuItems : [];
  }
}
