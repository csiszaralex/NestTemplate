import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const requiredRole = this.reflector.getAllAndOverride<string[]>('role', [
      ctx.getHandler(),
      ctx.getClass(),
    ]);

    const { user } = ctx.switchToHttp().getRequest();

    return requiredRole <= user.role;
  }
}
