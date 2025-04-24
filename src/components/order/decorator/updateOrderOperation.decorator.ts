import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ADMIN } from 'src/common/decorators/isAdmin.decorator';

export function UpdateOrderOperation() {
    return applyDecorators(
        ADMIN(),
        ApiBearerAuth(),
        ApiOperation({
            summary: 'Verify an order',
            description: 'Updates the status of an existing order to VERIFIED.',
        }),
        ApiResponse({
            status: 200,
            description: 'Order successfully verified.',
        }),
        ApiResponse({
            status: 404,
            description: 'Order not found.',
        }),
    );
}
