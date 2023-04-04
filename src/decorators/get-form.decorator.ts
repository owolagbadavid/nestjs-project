import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetForm = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const form = request.form;

    return form;
  },
);
