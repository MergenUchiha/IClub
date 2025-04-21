import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductResponseDto } from 'src/libs/contracts';

export function CreateProductOperation() {
    return applyDecorators(
        ApiOperation({
            summary: 'Create a new product',
            description:
                'Creates a new product with the specified name, region, and contacts.',
        }),
        ApiResponse({
            status: 201,
            description: 'The product has been successfully created.',
            type: ProductResponseDto,
        }),
    );
}
