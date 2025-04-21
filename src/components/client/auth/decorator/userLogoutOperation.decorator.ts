import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { USER } from 'src/common/decorators/isUser.decorator';
import { ClearCookieInterceptor } from 'src/common/interceptors/clearCookie.interceptor';

export function UserLogoutOperation() {
    return applyDecorators(
        USER(),
        ApiBearerAuth(),
        ApiOperation({ summary: 'Log out a user' }),
        ApiResponse({
            status: 200,
            description: 'User successfully logged out',
        }),
        ApiResponse({
            status: 401,
            description: 'Invalid or missing refresh token',
        }),
        UseInterceptors(ClearCookieInterceptor),
    );
}
