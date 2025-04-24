import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { USER } from 'src/common/decorators/isUser.decorator';

export function CancelOrderOperation() {
    return applyDecorators(
        USER(),
        ApiBearerAuth(),
        ApiOperation({
            summary: 'Cancel an order',
            description:
                'Cancels an existing order for the authenticated user, if it is not already verified.',
        }),
        ApiResponse({
            status: 200,
            description: 'Order successfully cancelled.',
        }),
        ApiResponse({
            status: 401,
            description:
                'Unauthorized access or attempting to cancel another user’s order.',
        }),
        ApiResponse({
            status: 404,
            description: 'Order or user not found.',
        }),
        ApiResponse({
            status: 409,
            description: 'Cannot cancel a verified order.',
        }),
    );
}
