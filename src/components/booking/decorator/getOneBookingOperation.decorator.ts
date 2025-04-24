import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { BookingResponseDto } from 'src/libs/contracts';

export function GetOneBookingOperation() {
    return applyDecorators(
        ApiOperation({ summary: 'Retrieve a single booking by ID' }),
        ApiParam({
            name: 'bookingId',
            description: 'Booking identifier',
        }),
        ApiResponse({
            status: 200,
            description: 'Booking successfully retrieved',
            type: BookingResponseDto,
        }),
        ApiResponse({
            status: 404,
            description: 'Booking not found',
        }),
    );
}
