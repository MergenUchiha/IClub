import { User } from '@prisma/client';

export class UserTokenDto {
    id!: string;
    phoneNumber!: string;
    isBanned!: boolean;

    constructor(user: User) {
        this.id = user.id;
        this.phoneNumber = user.phoneNumber;

        this.isBanned = user.isBanned;
    }
}
