import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { USER } from 'src/common/decorators/isUser.decorator';
import { ClearCookieInterceptor } from 'src/common/interceptors/clearCookie.interceptor';

export function UserLogoutOperation() {
    return applyDecorators(
        USER(),
        ApiBearerAuth(),
        ApiOperation({ summary: 'User user logout' }),
        ApiResponse({
            status: 200,
            description: 'User user logged out',
        }),
        ApiResponse({
            status: 401,
            description: 'User unauthorized!',
        }),
        ApiResponse({ status: 404, description: 'Token not found!' }),
        UseInterceptors(ClearCookieInterceptor),
    );
}
