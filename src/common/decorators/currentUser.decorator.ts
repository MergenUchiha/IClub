import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { AuthenticatedRequest } from '../interfaces/authenticatedRequest.interface';

export const CurrentUser = createParamDecorator(
    (data: never, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
        return request.currentUser;
    },
);
