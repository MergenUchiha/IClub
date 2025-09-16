import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DepartmentsResponseDto } from 'src/libs/contracts';

export function GetAllDepartmentsOperation() {
    return applyDecorators(
        ApiOperation({
            summary: 'Get a list of departments',
            description:
                'Returns a paginated list of departments with optional filtering by name.',
        }),
        ApiResponse({
            status: 200,
            description:
                'The list of departments has been successfully retrieved.',
            type: DepartmentsResponseDto,
        }),
    );
}
