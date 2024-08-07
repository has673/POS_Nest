import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      console.log('no header provided')
      throw new UnauthorizedException('No authorization header provided');
    }

    const token = authHeader;
    if (!token) {
      console.log('no token provided')
      throw new UnauthorizedException('No token provided');
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace 'yourSecretKey' with your actual secret key
      req['user'] = decoded;
      next();
    } catch (error) {
      console.log('invalid token')
      throw new UnauthorizedException('Invalid token');
    }
  }
}
