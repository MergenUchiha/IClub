import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BookingResponseDto } from 'src/libs/contracts';

export function CreateBookingOperation() {
    return applyDecorators(
        ApiOperation({ summary: 'Create a new booking' }),
        ApiResponse({
            status: 200,
            description: 'Booking successfully created',
            type: BookingResponseDto,
        }),
        ApiResponse({
            status: 400,
            description: 'Booking for the specified date already exists',
        }),
    );
}
