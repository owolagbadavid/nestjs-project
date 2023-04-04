import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from '../../types';

@Injectable()
export class RolesOrIdGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    //@what is the required role

    const requiredRole = this.reflector.getAllAndOverride<Role>('role', [
      context.getHandler(),
      context.getClass(),
    ]);
    console.log(requiredRole);

    if (!requiredRole) return true;

    const request = context.switchToHttp().getRequest();

    let userId: number;
    try {
      userId = parseInt(request.params.id);
      if (userId % 1 !== 0) throw new Error();
      request.params.id = userId;
    } catch (error) {
      throw new BadRequestException(
        'Validation failed (numeric string is expected)',
      );
    }

    const { user } = request;
    if (!user) return false;

    if (userId === request.user.id) return true;

    //does the user have the required role

    return requiredRole === user.role;
  }
}
