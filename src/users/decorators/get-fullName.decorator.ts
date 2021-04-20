import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../entities/user.entity';

export const GetFullName = createParamDecorator((_, ctx: ExecutionContext): string => {
  const req = ctx.switchToHttp().getRequest();
  const user: User = req.user;

  return user.fullName;
});
