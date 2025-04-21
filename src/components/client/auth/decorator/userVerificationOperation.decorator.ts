import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PUBLIC } from 'src/common/decorators/isPublic.decorator';

export function UserVerificationOperation() {
    return applyDecorators(
        PUBLIC(),
        ApiOperation({ summary: 'Verify a user’s phone number' }),
        ApiResponse({
            status: 200,
            description: 'User successfully verified',
        }),
        ApiResponse({
            status: 400,
            description: 'Invalid verification code',
        }),
        ApiResponse({
            status: 409,
            description: 'User already verified',
        }),
        ApiResponse({
            status: 404,
            description: 'User not found',
        }),
        ApiResponse({
            status: 401,
            description: 'Unauthorized access',
        }),
    );
}
