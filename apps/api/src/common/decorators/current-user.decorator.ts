import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthPayload } from '../types/auth-request.type';

export const CurrentUser = createParamDecorator((_: unknown, ctx: ExecutionContext): AuthPayload => {
  const req = ctx.switchToHttp().getRequest();
  return req.user as AuthPayload;
});
