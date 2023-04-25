import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetPD = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const pd = request.pd;

    return pd;
  },
);
