import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class CategoryModifyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Log the user object to see what is being passed in
    console.debug('User:', user);

    if ((user.allowCategoryModify = true)) {
      console.debug('User is allowed to modify categories. Access granted.');
      return true;
    }

    console.debug('User is not allowed to modify categories. Access denied.');
    throw new ForbiddenException(
      'You do not have permission to modify categories',
    );
  }
}
