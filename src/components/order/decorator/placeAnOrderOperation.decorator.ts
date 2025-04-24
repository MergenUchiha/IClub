import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { USER } from 'src/common/decorators/isUser.decorator';
import { OrderResponseDto } from 'src/libs/contracts';

export function PlaceAnOrderOperation() {
    return applyDecorators(
        USER(),
        ApiBearerAuth(),
        ApiOperation({
            summary: 'Create a new order',
            description:
                'Places a new order for the authenticated user with the specified items and status.',
        }),
        ApiResponse({
            status: 201,
            description: 'Order successfully created.',
            type: OrderResponseDto,
        }),
        ApiResponse({
            status: 400,
            description: 'Invalid input data or order creation conflict.',
        }),
        ApiResponse({
            status: 401,
            description: 'Unauthorized access.',
        }),
        ApiResponse({
            status: 404,
            description: 'User not found.',
        }),
    );
}
