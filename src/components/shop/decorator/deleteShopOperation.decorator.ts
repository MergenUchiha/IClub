import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

export function DeleteShopOperation() {
    return applyDecorators(
        ApiOperation({
            summary: 'Delete a shop',
            description:
                'Deletes a shop and all its dependencies (products, images) by its ID.',
        }),
        ApiParam({
            name: 'shopId',
            type: String,
            format: 'uuid',
            example: '550e8400-e29b-41d4-a716-446655440000',
        }),
        ApiResponse({
            status: 200,
            description: 'The shop has been successfully deleted',
        }),
        ApiResponse({
            status: 404,
            description: 'Shop not found',
        }),
    );
}
