import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TransformDataInterceptor } from 'src/common/interceptors/transformData.interceptor';
import { SetCookieInterceptor } from 'src/common/interceptors/setCookie.interceptor';
import { PUBLIC } from 'src/common/decorators/isPublic.decorator';
import { AdminAuthTokenResponseDto } from 'src/libs/contracts';

export function AdminLoginOperation() {
    return applyDecorators(
        PUBLIC(),
        ApiOperation({ summary: 'Admin login' }),
        ApiResponse({ status: 200, type: AdminAuthTokenResponseDto }),
        ApiResponse({ status: 400, description: 'Password incorrect!' }),
        ApiResponse({ status: 404, description: 'Admin not found!' }),
        UseInterceptors(
            SetCookieInterceptor,
            new TransformDataInterceptor(AdminAuthTokenResponseDto),
        ),
    );
}
