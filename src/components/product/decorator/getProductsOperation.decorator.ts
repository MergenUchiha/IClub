import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ProductsResponseDto } from 'src/libs/contracts';

export function GetProductsOperation() {
    return applyDecorators(
        ApiOperation({
            summary: 'Get a list of products',
            description:
                'Returns a paginated list of products with optional filtering by name.',
        }),
        ApiQuery({ name: 'page', type: Number, required: false, example: 1 }),
        ApiQuery({ name: 'take', type: Number, required: false, example: 5 }),
        ApiQuery({ name: 'q', type: String, required: false, example: 'shop' }),
        ApiResponse({
            status: 200,
            description:
                'The list of products has been successfully retrieved.',
            type: ProductsResponseDto,
        }),
    );
}
