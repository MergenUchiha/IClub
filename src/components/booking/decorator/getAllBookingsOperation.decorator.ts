import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BookingsResponseDto } from 'src/libs/contracts';

export function GetAllBookingsOperation() {
    return applyDecorators(
        ApiOperation({ summary: 'Retrieve a list of all bookings' }),
        ApiResponse({
            status: 200,
            description: 'List of bookings successfully retrieved',
            type: BookingsResponseDto,
        }),
    );
}
