import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PUBLIC } from 'src/common/decorators/isPublic.decorator';
import { SetCookieInterceptor } from 'src/common/interceptors/setCookie.interceptor';
import { TransformDataInterceptor } from 'src/common/interceptors/transformData.interceptor';
import { AdminAuthTokenResponseDto } from 'src/libs/contracts';

export function AdminRefreshOperation() {
    return applyDecorators(
        PUBLIC(),
        ApiOperation({ summary: 'Refresh admin token' }),
        ApiResponse({ status: 200, type: AdminAuthTokenResponseDto }),
        ApiResponse({
            status: 401,
            description: 'Refresh token not provided! OR User unauthorized!',
        }),
        ApiResponse({
            status: 404,
            description: 'Token not found! OR Admin not found!',
        }),
        UseInterceptors(
            SetCookieInterceptor,
            new TransformDataInterceptor(AdminAuthTokenResponseDto),
        ),
    );
}
