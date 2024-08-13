import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client'; // Ensure this is the correct import for your Role enum
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}



  canActivate(context: ExecutionContext): boolean {

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      console.debug('Route is public. Access granted.');
      return true; // If the route is public, allow access
    }
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    console.debug('Required Roles:', requiredRoles);

    if (!requiredRoles) {
      console.debug('No roles required for this route. Access granted.');
      return true; // If no roles are required, allow access
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.debug('User:', user);
    console.debug('User Role:', user?.role);

    // Check if user role allows access
    if (requiredRoles.includes(user?.role)) {
      console.debug('User role is included in the required roles. Access granted.');
      return true;
    }

    // Admin can view Subadmin but not vice versa
    if (user?.role === Role.ADMIN && requiredRoles.some(role => role === Role.SUBADMIN)) {
      console.debug('User role is ADMIN and required role includes SUBADMIN. Access granted.');
      return true;
    }

    // Log the reason for denial
    console.debug(`User role does not match any required role and is not allowed ${requiredRoles}`);
    throw new ForbiddenException('Access denied');
  }
}
