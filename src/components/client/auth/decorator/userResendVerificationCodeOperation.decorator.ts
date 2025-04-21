import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PUBLIC } from 'src/common/decorators/isPublic.decorator';

export function UserResendVerificationCodeOperation() {
    return applyDecorators(
        PUBLIC(),
        ApiOperation({ summary: 'Resend verification code' }),
        ApiResponse({
            status: 200,
            description: 'Verification code resent successfully',
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
