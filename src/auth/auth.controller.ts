import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Put,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Prisma } from '@prisma/client';
import { Request } from 'express';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { SkipThrottle } from '@nestjs/throttler';
import { ChangeAccessDto } from './dto/change-acces.dto';
import { RolesGuard } from 'src/common/roles/role.guard';
import { Roles } from 'src/common/roles/role.decorator';
import { Role } from 'src/common/roles/role.enum';

@ApiTags('Auth')
@UseGuards(RolesGuard)
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
  async getProfile(@Param('id') id: string, @Req() req: Request) {
    console.log(req.url, ' ', req.headers['authorization']);
    const userIdFromToken = req['user']?.userId;
    console.debug(userIdFromToken);
    const userId = parseInt(id);
    console.log(req['user']);
    if (userId !== userIdFromToken) {
      throw new UnauthorizedException('You can only update your own profile');
    }

    return await this.authService.getProfile(userIdFromToken);
  }

  @Get('userdata/get')
  async getUserData(@Req() req: Request) {
    console.log(req.url, ' ', req.headers['authorization']);
    try {
      const user = req['user'];
      return user;
      console.log(user);
    } catch (err) {
      console.log(err);
    }
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
    console.log(req['user']);
    if (userIdFromParam !== userIdFromToken) {
      throw new UnauthorizedException('You can only update your own profile');
    }

    return await this.authService.update(userIdFromParam, file);
  }

  @Put(':id')
  async updateProfile(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() UpdateAuthDto: UpdateAuthDto,
  ) {
    // const userIdFromParam = parseInt(id);
    // const userIdFromToken = req['user']?.userId;
    console.log(req.url, ' ', req.headers['authorization']);
    const userIdFromToken = req['user']?.userId;
    console.debug(userIdFromToken);
    const userId = parseInt(id);
    if (userId !== userIdFromToken) {
      throw new UnauthorizedException('You can only update your own profile');
    }
    return await this.authService.updateProfile(userId, UpdateAuthDto);
  }
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }
  @SkipThrottle()
  @Get()
  async getUser() {
    return this.authService.getUsers();
  }

  @Patch(':id/acceschange')
  @Roles(Role.ADMIN)
  async changeAccess(
    @Body() changeAccess: ChangeAccessDto,
    @Param('id') id: number,
  ) {
    return this.authService.modifyAccess(+id, changeAccess);
  }
}
