import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ADMIN } from 'src/common/decorators/isAdmin.decorator';

export function CancelOrderByAdminOperation() {
    return applyDecorators(
        ADMIN(),
        ApiBearerAuth(),
        ApiOperation({
            summary: 'Cancel an order by admin',
            description:
                'Cancels an existing order for the authenticated user, if it is not already verified.',
        }),
        ApiResponse({
            status: 200,
            description: 'Order successfully cancelled.',
        }),
        ApiResponse({
            status: 401,
            description: 'User unauthorized!',
        }),
        ApiResponse({
            status: 404,
            description: 'Order not found.',
        }),
        ApiResponse({
            status: 409,
            description: 'Cannot cancel a verified or completed order.',
        }),
    );
}
