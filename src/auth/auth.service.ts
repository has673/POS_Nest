import { Injectable } from '@nestjs/common';
// import { CreateAuthDto } from './dto/create-auth.dto';
// import { UpdateAuthDto } from './dto/update-auth.dto';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';


@Injectable()
export class AuthService {
  constructor(private readonly datbaseService:DatabaseService){}
  create(createAuthDto: Prisma.UserCreateInput) {
    return 'This action adds a new auth';
  }
  async findunique(email:string){
    const user = this.datbaseService.user.findUnique({
      where:{
        email
      }
    })
    return user

  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
