import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TransformDataInterceptor } from 'src/common/interceptors/transformData.interceptor';
import { SetCookieInterceptor } from 'src/common/interceptors/setCookie.interceptor';
import { PUBLIC } from 'src/common/decorators/isPublic.decorator';
import { UserAuthTokenResponseDto } from 'src/libs/contracts';

export function UserLoginOperation() {
    return applyDecorators(
        PUBLIC(),
        ApiOperation({ summary: 'User login' }),
        ApiResponse({ status: 200, type: UserAuthTokenResponseDto }),
        ApiResponse({ status: 400, description: 'Password incorrect!' }),
        ApiResponse({ status: 404, description: 'User not found!' }),
        UseInterceptors(
            SetCookieInterceptor,
            new TransformDataInterceptor(UserAuthTokenResponseDto),
        ),
    );
}
