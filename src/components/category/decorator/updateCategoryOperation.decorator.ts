import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CategoryResponseDto } from 'src/libs/contracts';

export function UpdateCategoryOperation() {
    return applyDecorators(
        ApiOperation({
            summary: 'Update a category',
            description:
                'Updates the details of a specific category by its ID.',
        }),
        ApiParam({
            name: 'categoryId',
            type: String,
            format: 'uuid',
            example: '550e8400-e29b-41d4-a716-446655440000',
        }),
        ApiResponse({
            status: 200,
            description: 'The category has been successfully updated.',
            type: CategoryResponseDto,
        }),
        ApiResponse({
            status: 404,
            description: 'Category not found',
        }),
        ApiResponse({
            status: 409,
            description: 'Category name already exists',
        }),
    );
}
