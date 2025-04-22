import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PUBLIC } from 'src/common/decorators/isPublic.decorator';
import { SetCookieInterceptor } from 'src/common/interceptors/setCookie.interceptor';
import { TransformDataInterceptor } from 'src/common/interceptors/transformData.interceptor';
import { UserAuthTokenResponseDto } from 'src/libs/contracts';

export function UserRefreshOperation() {
    return applyDecorators(
        PUBLIC(),
        ApiOperation({ summary: 'Refresh user token' }),
        ApiResponse({ status: 200, type: UserAuthTokenResponseDto }),
        ApiResponse({
            status: 401,
            description: 'Refresh token not provided! OR user unauthorized!',
        }),
        ApiResponse({
            status: 404,
            description: 'Token not found! OR user not found!',
        }),
        UseInterceptors(
            SetCookieInterceptor,
            new TransformDataInterceptor(UserAuthTokenResponseDto),
        ),
    );
}
