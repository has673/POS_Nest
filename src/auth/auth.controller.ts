import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Prisma } from '@prisma/client';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  create(@Body() CreateAuthDto: Prisma.UserCreateInput) {
    return this.authService.signup(CreateAuthDto);
  }

  @Post('login')
  login(@Body() CreateAuthDto: Prisma.UserCreateInput) {
    return this.authService.login(CreateAuthDto);
  }

  @Post('recover-password')
  async recoverPassword(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    return this.authService.recoverPassword(email, password);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() body: { email: string; otp: number }) {
    const { email, otp } = body;
    return this.authService.verifyOtp(email, otp);
  }

  @Post('new-otp')
  async newOtp(@Body() body: { email: string }) {
    const { email } = body;
    return this.authService.newOtp(email);
  }

  @Get(':id')
  async getProfile(@Param('id') id:string , @Req() req:Request ) {
    console.log(req.url," ",req.headers['authorization'])
    const userIdFromParam = parseInt(id);
    const userIdFromToken = req['user']?.userId;
    console.log(req['user'])
    if (userIdFromParam !== userIdFromToken) {
      throw new UnauthorizedException('You can only update your own profile');
    }

    return await this.authService.getProfile(userIdFromToken);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
  @Param('id') id: string, 
  @UploadedFile() file: Express.Multer.File,
   @Req() req: Request,
  
 

) {
    console.debug('Uploaded file:', file);
    const userIdFromParam = parseInt(id);
    const userIdFromToken = req['user']?.userId;
    console.log(req['user'])
    if (userIdFromParam !== userIdFromToken) {
      throw new UnauthorizedException('You can only update your own profile');
    }

    return await this.authService.update(userIdFromParam,file);
  }

  

}
