import { applyDecorators } from '@nestjs/common';
import { PUBLIC } from 'src/common/decorators/isPublic.decorator';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CategoriesResponseDto } from 'src/libs/contracts';

export function GetCategoriesOperation() {
    return applyDecorators(
        PUBLIC(),
        ApiOperation({
            summary: 'Get a list of categories',
            description:
                'Returns a paginated list of categories with optional filtering by name.',
        }),
        ApiQuery({ name: 'page', type: Number, required: false, example: 1 }),
        ApiQuery({ name: 'take', type: Number, required: false, example: 5 }),
        ApiQuery({ name: 'q', type: String, required: false, example: 'shop' }),
        ApiResponse({
            status: 200,
            description:
                'The list of categories has been successfully retrieved.',
            type: CategoriesResponseDto,
        }),
    );
}
