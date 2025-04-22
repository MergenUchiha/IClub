import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ProductResponseDto } from 'src/libs/contracts';

export function GetOneProductOperation() {
    return applyDecorators(
        ApiOperation({
            summary: 'Get product details',
            description:
                'Returns detailed information about a specific product by its ID.',
        }),
        ApiParam({
            name: 'productId',
            type: String,
            format: 'uuid',
            example: '550e8400-e29b-41d4-a716-446655440000',
        }),
        ApiResponse({
            status: 200,
            description: 'The product has been successfully retrieved.',
            type: ProductResponseDto,
        }),
        ApiResponse({
            status: 404,
            description: 'Product not found',
        }),
    );
}
