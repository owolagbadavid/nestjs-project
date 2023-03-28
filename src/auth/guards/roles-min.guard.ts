import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from '../../entities/roles.enum';

@Injectable()
export class RolesMinGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    //what is the required role

    const requiredMinRole = this.reflector.getAllAndOverride<Role[]>('role', [
      context.getHandler(),
      context.getClass(),
    ]);
    // !console.log
    console.log(requiredMinRole);

    if (!requiredMinRole) return true;

    const { user } = context.switchToHttp().getRequest();

    if (!user) return false;

    //does the user have the required role

    return user.role >= requiredMinRole;
  }
}
