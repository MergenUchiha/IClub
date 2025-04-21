import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ShopResponseDto } from 'src/libs/contracts';

export function GetOneShopOperation() {
    return applyDecorators(
        ApiOperation({
            summary: 'Get shop details',
            description:
                'Returns detailed information about a specific shop by its ID.',
        }),
        ApiParam({
            name: 'shopId',
            type: String,
            format: 'uuid',
            example: '550e8400-e29b-41d4-a716-446655440000',
        }),
        ApiResponse({
            status: 200,
            description: 'The shop has been successfully retrieved.',
            type: ShopResponseDto,
        }),
        ApiResponse({
            status: 404,
            description: 'Shop not found',
        }),
    );
}
