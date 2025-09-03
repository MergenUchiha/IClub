import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { USER } from 'src/common/decorators/isUser.decorator';

export function DeleteBookingDetailOperation() {
    return applyDecorators(
        USER(),
        ApiOperation({ summary: 'Delete booking details' }),
        ApiParam({
            name: 'detailId',
            description: 'Booking detail identifier',
        }),
        ApiResponse({
            status: 200,
            description: 'Booking details successfully deleted',
        }),
        ApiResponse({
            status: 404,
            description: 'Booking detail not found',
        }),
    );
}
