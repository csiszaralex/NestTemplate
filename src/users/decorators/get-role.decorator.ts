import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../entities/user.entity';

export const GetRole = createParamDecorator((_, ctx: ExecutionContext): number => {
  const req = ctx.switchToHttp().getRequest();
  const user: User = req.user;

  return user.role;
});
