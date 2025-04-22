import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CategoryResponseDto } from 'src/libs/contracts';

export function CreateCategoryOperation() {
    return applyDecorators(
        ApiOperation({
            summary: 'Create a new category',
            description:
                'Creates a new category with the specified name, region, and contacts.',
        }),
        ApiResponse({
            status: 201,
            description: 'The category has been successfully created.',
            type: CategoryResponseDto,
        }),
        ApiResponse({
            status: 409,
            description: 'Category name already exists',
        }),
    );
}
