import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { USER } from 'src/common/decorators/isUser.decorator';
import { SetCookieInterceptor } from 'src/common/interceptors/setCookie.interceptor';
import { TransformDataInterceptor } from 'src/common/interceptors/transformData.interceptor';
import { UserAuthTokenResponseDto } from 'src/libs/contracts';

export function UserRefreshTokenOperation() {
    return applyDecorators(
        USER(),
        ApiBearerAuth(),
        ApiOperation({ summary: 'Refresh user tokens' }),
        ApiResponse({
            status: 200,
            description: 'User tokens refreshed',
            type: UserAuthTokenResponseDto,
        }),
        ApiResponse({
            status: 401,
            description: 'Invalid token',
        }),
        ApiResponse({
            status: 404,
            description: 'User not found',
        }),
        UseInterceptors(
            SetCookieInterceptor,
            new TransformDataInterceptor(UserAuthTokenResponseDto),
        ),
    );
}
