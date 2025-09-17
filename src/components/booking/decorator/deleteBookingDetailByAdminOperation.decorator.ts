import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ADMIN } from 'src/common/decorators/isAdmin.decorator';

export function DeleteBookingDetailByAdminOperation() {
    return applyDecorators(
        ADMIN(),
        ApiOperation({ summary: 'Delete booking details by admin' }),
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
