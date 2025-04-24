import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { USER } from 'src/common/decorators/isUser.decorator';
import { OrdersResponseDto } from 'src/libs/contracts';

export function GetMyOrdersOperation() {
    return applyDecorators(
        USER(),
        ApiBearerAuth(),
        ApiOperation({
            summary: 'Get all my orders',
            description:
                'Retrieves all orders for the authenticated my, sorted by creation date in descending order.',
        }),
        ApiResponse({
            status: 200,
            description: 'My orders successfully retrieved.',
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
