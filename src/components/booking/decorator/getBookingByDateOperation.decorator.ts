import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { USER } from 'src/common/decorators/isUser.decorator';
import { BookingResponseDto } from 'src/libs/contracts';

export function GetBookingByDateOperation() {
    return applyDecorators(
        USER(),
        ApiOperation({ summary: 'Retrieve a single booking by date' }),
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
