import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { USER } from 'src/common/decorators/isUser.decorator';
import { OrderResponseDto } from 'src/libs/contracts';

export function GetMyOneOrderOperation() {
    return applyDecorators(
        USER(),
        ApiBearerAuth(),
        ApiOperation({
            summary: 'Get a single my order',
            description:
                'Retrieves the details of a specific order for the authenticated my by its ID.',
        }),
        ApiResponse({
            status: 200,
            description: 'My order successfully retrieved.',
            type: OrderResponseDto,
        }),
        ApiResponse({
            status: 401,
            description: 'Unauthorized access.',
        }),
        ApiResponse({
            status: 404,
            description: 'Order or user not found.',
        }),
    );
}
