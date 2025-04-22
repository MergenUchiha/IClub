import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { USER } from 'src/common/decorators/isUser.decorator';
import { UserResponseDto } from 'src/libs/contracts';

export function GetMeOperation() {
    return applyDecorators(
        USER(),
        ApiBearerAuth(),
        ApiOperation({ summary: 'User user logout' }),
        ApiResponse({
            status: 200,
            description: 'User received',
            type: UserResponseDto,
        }),
        ApiResponse({
            status: 401,
            description: 'User unauthorized!',
        }),
        ApiResponse({ status: 404, description: 'User not found!' }),
    );
}
