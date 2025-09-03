import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ADMIN } from 'src/common/decorators/isAdmin.decorator';
import { BookingResponseDto } from 'src/libs/contracts';

export function GetOneBookingOperation() {
    return applyDecorators(
        ADMIN(),
        ApiOperation({ summary: 'Retrieve a single booking by ID for admin' }),
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
