import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ShopResponseDto } from 'src/libs/contracts';

export function UpdateShopOperation() {
    return applyDecorators(
        ApiOperation({
            summary: 'Update a shop',
            description: 'Updates the details of a specific shop by its ID.',
        }),
        ApiParam({
            name: 'shopId',
            type: String,
            format: 'uuid',
            example: '550e8400-e29b-41d4-a716-446655440000',
        }),
        ApiResponse({
            status: 200,
            description: 'The shop has been successfully updated.',
            type: ShopResponseDto,
        }),
        ApiResponse({
            status: 404,
            description: 'Shop not found',
        }),
        ApiResponse({
            status: 409,
            description: 'Shop name already exists',
        }),
    );
}
