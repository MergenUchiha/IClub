import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ADMIN } from 'src/common/decorators/isAdmin.decorator';
import { ClearCookieInterceptor } from 'src/common/interceptors/clearCookie.interceptor';

export function AdminLogoutOperation() {
    return applyDecorators(
        ADMIN(),
        ApiBearerAuth(),
        ApiOperation({ summary: 'Admin user logout' }),
        ApiResponse({
            status: 200,
            description: 'Admin user logged out',
        }),
        ApiResponse({
            status: 401,
            description: 'User unauthorized!',
        }),
        ApiResponse({ status: 404, description: 'Token not found!' }),
        UseInterceptors(ClearCookieInterceptor),
    );
}
