import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ADMIN } from 'src/common/decorators/isAdmin.decorator';
import { USER } from 'src/common/decorators/isUser.decorator';
import { BookingsResponseDto } from 'src/libs/contracts';

export function GetAllBookingsForAdminOperation() {
    return applyDecorators(
        ADMIN(),
        ApiOperation({ summary: 'Retrieve a list of all bookings for admin' }),
        ApiResponse({
            status: 200,
            description: 'List of bookings successfully retrieved',
            type: BookingsResponseDto,
        }),
    );
}

export function GetAllBookingsOperation() {
    return applyDecorators(
        USER(),
        ApiOperation({ summary: 'Retrieve a list of all bookings' }),
        ApiResponse({
            status: 200,
            description: 'List of bookings successfully retrieved',
            type: BookingsResponseDto,
        }),
    );
}
