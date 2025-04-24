import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ADMIN } from 'src/common/decorators/isAdmin.decorator';
import { OrderResponseDto } from 'src/libs/contracts';

export function GetOneOrderOperation() {
    return applyDecorators(
        ADMIN(),
        ApiBearerAuth(),
        ApiOperation({
            summary: 'Get a single order',
            description: 'Retrieves the details of a specific order by its ID.',
        }),
        ApiResponse({
            status: 200,
            description: 'Order successfully retrieved.',
            type: OrderResponseDto,
        }),
        ApiResponse({
            status: 404,
            description: 'Order not found.',
        }),
    );
}
