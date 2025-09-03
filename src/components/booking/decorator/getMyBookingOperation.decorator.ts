import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { USER } from 'src/common/decorators/isUser.decorator';
import { DetailsResponseDto } from 'src/libs/contracts';

export function GetMyBookingOperation() {
    return applyDecorators(
        USER(),
        ApiOperation({ summary: 'Retrieve a list of all my booking details' }),
        ApiResponse({
            status: 200,
            description:
                'List of all my booking details successfully retrieved',
            type: DetailsResponseDto,
        }),
    );
}
