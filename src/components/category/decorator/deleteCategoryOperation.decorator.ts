import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

export function DeleteCategoryOperation() {
    return applyDecorators(
        ApiOperation({
            summary: 'Delete a category',
            description:
                'Deletes a category and all its dependencies (products, images) by its ID.',
        }),
        ApiParam({
            name: 'categoryId',
            type: String,
            format: 'uuid',
            example: '550e8400-e29b-41d4-a716-446655440000',
        }),
        ApiResponse({
            status: 200,
            description: 'The category has been successfully deleted',
        }),
        ApiResponse({
            status: 404,
            description: 'Category not found',
        }),
    );
}
