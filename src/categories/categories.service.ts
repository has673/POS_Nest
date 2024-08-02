import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';


@Injectable()
export class CategoriesService {
  constructor(private readonly datbaseService:DatabaseService){}

  create(createCategoryDto: Prisma.CategoryCreateInput) {
    return this.datbaseService.category.create({
      data:createCategoryDto
    });
  }

  findAll() {
    return this.datbaseService.category.findMany();
  }

  findOne(id: number) {
    return this.datbaseService.category.findFirst({
      where:{
        id,
      }
    });
  }

  update(id: number, updateCategoryDto: Prisma.CategoryUpdateInput) {
    return this.datbaseService.category.update({
      where:{
        id,
      },data:updateCategoryDto
    });
  }

  remove(id: number) {
    return this.datbaseService.category.delete({
      where:{
        id
      }
    });
  }

async   findmenu(id:number){
    const category = await this.datbaseService.category.findFirst({
      where:{
        id,
      },
      include:{
        menuItems:true
      }
    })
    return category? category.menuItems:[]
  }
 
}
