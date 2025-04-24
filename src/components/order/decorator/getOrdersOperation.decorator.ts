import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ADMIN } from 'src/common/decorators/isAdmin.decorator';
import { OrdersResponseDto } from 'src/libs/contracts';

export function GetOrdersOperation() {
    return applyDecorators(
        ADMIN(),
        ApiBearerAuth(),
        ApiOperation({
            summary: 'Get all user orders',
            description:
                'Retrieves all orders for the authenticated user, sorted by creation date in descending order.',
        }),
        ApiResponse({
            status: 200,
            description: 'User’s orders successfully retrieved.',
            type: OrdersResponseDto,
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
