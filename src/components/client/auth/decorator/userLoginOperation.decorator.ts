import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PUBLIC } from 'src/common/decorators/isPublic.decorator';
import { SetCookieInterceptor } from 'src/common/interceptors/setCookie.interceptor';
import { TransformDataInterceptor } from 'src/common/interceptors/transformData.interceptor';
import { UserAuthTokenResponseDto } from 'src/libs/contracts';

export function UserLoginOperation() {
    return applyDecorators(
        PUBLIC(),
        ApiOperation({ summary: 'Log in a user' }),
        ApiResponse({
            status: 200,
            description: 'User successfully logged in',
            type: UserAuthTokenResponseDto,
        }),
        ApiResponse({
            status: 400,
            description: 'Invalid credentials',
        }),
        ApiResponse({
            status: 403,
            description: 'User is not verified',
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
