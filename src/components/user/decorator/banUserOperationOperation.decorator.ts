import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

export function BanUserOperation() {
    return applyDecorators(
        ApiOperation({
            summary: 'Ban a user',
            description: 'Ban user by its ID.',
        }),
        ApiParam({
            name: 'userId',
            type: String,
            format: 'uuid',
            example: '550e8400-e29b-41d4-a716-446655440000',
        }),
        ApiResponse({
            status: 200,
            description: 'The user has been successfully banned.',
        }),
        ApiResponse({
            status: 404,
            description: 'User not found',
        }),
    );
}
