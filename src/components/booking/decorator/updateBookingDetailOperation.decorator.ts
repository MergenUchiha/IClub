import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { DetailResponseDto } from 'src/libs/contracts';

export function UpdateBookingDetailOperation() {
    return applyDecorators(
        ApiOperation({ summary: 'Update booking details' }),
        ApiParam({
            name: 'detailId',
            description: 'Booking detail identifier',
        }),
        ApiResponse({
            status: 200,
            description: 'Booking details successfully updated',
            type: DetailResponseDto,
        }),
        ApiResponse({
            status: 404,
            description: 'Booking detail not found',
        }),
    );
}
