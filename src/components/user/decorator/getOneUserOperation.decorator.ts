import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UserResponseDto } from 'src/libs/contracts';

export function GetOneUserOperation() {
    return applyDecorators(
        ApiOperation({
            summary: 'Get user details',
            description:
                'Returns detailed information about a specific user by its ID.',
        }),
        ApiParam({
            name: 'userId',
            type: String,
            format: 'uuid',
            example: '550e8400-e29b-41d4-a716-446655440000',
        }),
        ApiResponse({
            status: 200,
            description: 'The user has been successfully retrieved.',
            type: UserResponseDto,
        }),
        ApiResponse({
            status: 404,
            description: 'User not found',
        }),
    );
}
