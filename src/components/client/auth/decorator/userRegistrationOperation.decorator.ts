import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PUBLIC } from 'src/common/decorators/isPublic.decorator';
import { TransformDataInterceptor } from 'src/common/interceptors/transformData.interceptor';
import { UserResponseDto } from 'src/libs/contracts';

export function UserRegistrationOperation() {
    return applyDecorators(
        PUBLIC(),
        ApiOperation({ summary: 'Register a new user' }),
        ApiResponse({
            status: 200,
            description: 'User successfully registered',
            type: UserResponseDto,
        }),
        ApiResponse({
            status: 400,
            description: 'Invalid request data',
        }),
        ApiResponse({
            status: 409,
            description: 'Phone number already exists',
        }),
        UseInterceptors(new TransformDataInterceptor(UserResponseDto)),
    );
}
