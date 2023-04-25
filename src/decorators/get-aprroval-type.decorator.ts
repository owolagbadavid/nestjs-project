import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetApproval = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const approval = request.approval;

    return approval;
  },
);
