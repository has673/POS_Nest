import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('No authorization header provided');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace 'yourSecretKey' with your actual secret key
      req['user'] = decoded;
      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
