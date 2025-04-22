import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CategoryResponseDto } from 'src/libs/contracts';

export function GetOneCategoryOperation() {
    return applyDecorators(
        ApiOperation({
            summary: 'Get category details',
            description:
                'Returns detailed information about a specific category by its ID.',
        }),
        ApiParam({
            name: 'categoryId',
            type: String,
            format: 'uuid',
            example: '550e8400-e29b-41d4-a716-446655440000',
        }),
        ApiResponse({
            status: 200,
            description: 'The category has been successfully retrieved.',
            type: CategoryResponseDto,
        }),
        ApiResponse({
            status: 404,
            description: 'Category not found',
        }),
    );
}
