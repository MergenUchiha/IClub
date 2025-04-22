import { ApiProperty } from '@nestjs/swagger';
import { Admin } from '@prisma/client';

export class AdminTokenDto {
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
    id: string;
    @ApiProperty({ example: 'adolf' })
    username: string;

    constructor(model: Admin) {
        this.id = model.id;
        this.username = model.username;
    }
}
