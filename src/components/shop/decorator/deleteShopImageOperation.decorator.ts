import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function DeleteShopImageOperation() {
    return applyDecorators(
        ApiOperation({ summary: 'Delete category media files' }),
        ApiResponse({
            status: 200,
            description: 'Shop image deleted',
        }),
        ApiResponse({ status: 404, description: 'Shop not found' }),
    );
}
