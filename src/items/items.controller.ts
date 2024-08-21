import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { Prisma } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { S3Service } from 'src/s3/s3.service';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Items')
@Controller('items')
export class ItemsController {
  constructor(
    private readonly itemsService: ItemsService,
    private readonly s3Service: S3Service,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createItemDto: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    createItemDto.price = parseInt(createItemDto.price);
    createItemDto.categoryId = parseInt(createItemDto.categoryId);
    return this.itemsService.create(createItemDto, file);
  }

  @Get()
  findAll() {
    return this.itemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemsService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: string,
    @Body() updateItemDto: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    updateItemDto.price = parseInt(updateItemDto.price);
    updateItemDto.categoryId = parseInt(updateItemDto.categoryId);
    return this.itemsService.update(+id, updateItemDto, file);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemsService.remove(+id);
  }
}
