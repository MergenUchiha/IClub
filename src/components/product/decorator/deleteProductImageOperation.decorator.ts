import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function DeleteProductImageOperation() {
    return applyDecorators(
        ApiOperation({ summary: 'Delete category media files' }),
        ApiResponse({
            status: 200,
            description: 'Product image deleted',
        }),
        ApiResponse({ status: 404, description: 'Product not found' }),
    );
}
