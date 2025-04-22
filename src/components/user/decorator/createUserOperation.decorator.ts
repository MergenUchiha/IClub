import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserResponseDto } from 'src/libs/contracts';

export function CreateUserOperation() {
    return applyDecorators(
        ApiOperation({
            summary: 'Create a new user',
            description:
                'Creates a new user with the specified name, region, and contacts.',
        }),
        ApiResponse({
            status: 201,
            description: 'The user has been successfully created.',
            type: UserResponseDto,
        }),
        ApiResponse({
            status: 409,
            description: 'User name already exists',
        }),
    );
}
