import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { BookingResponseDto } from 'src/libs/contracts';

export function AddToExistingBookingOperation() {
    return applyDecorators(
        ApiOperation({ summary: 'Add details to an existing booking' }),
        ApiParam({
            name: 'bookingId',
            description: 'Booking identifier',
        }),
        ApiResponse({
            status: 200,
            description: 'Details successfully added to the booking',
            type: BookingResponseDto,
        }),
        ApiResponse({
            status: 404,
            description: 'Booking not found',
        }),
    );
}
