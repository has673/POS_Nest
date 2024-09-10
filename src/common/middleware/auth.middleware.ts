import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    console.log(req.url, ' ', authHeader);
    if (!authHeader) {
      console.log('no header provided');
      throw new UnauthorizedException('No authorization header provided');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      console.log('no token provided');
      throw new UnauthorizedException('No token provided');
    }

    try {
      console.log('try---');
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
        userId: number;
        email: string;
        role: Role;
        allowReservation: boolean;
        allowStaffModify: boolean;
        allowCategoryModify: boolean;
      };
      req['user'] = decoded;
      console.log('Decoded JWT:', decoded);

      next();
    } catch (error) {
      console.log('invalid token');
      throw new UnauthorizedException('Invalid token');
    }
  }
}
