import { Injectable } from '@nestjs/common';
import { generateHash } from 'src/helpers/providers/generateHash';
import {
    TApiUserResponse,
    TApiUsersResponse,
    UserCreateDto,
    UserResponseSchema,
    UsersResponseSchema,
    UserUpdateDto,
} from 'src/libs/contracts';
import {
    UserNotFoundException,
    UserPhoneNumberAlreadyExistsException,
} from 'src/libs/contracts/exceptions';
import { TApiResp } from 'src/libs/contracts/interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async createUser(dto: UserCreateDto): Promise<TApiResp<TApiUserResponse>> {
        await this.isPhoneNumberExist(dto.phoneNumber);
        const hashedPassword = await generateHash(dto.password);
        dto.password = hashedPassword;
        const user = await this.prisma.user.create({
            data: {
                firstName: dto.firstName,
                secondName: dto.secondName,
                phoneNumber: dto.phoneNumber,
                password: dto.password,
            },
        });
        const parsed = UserResponseSchema.parse(user);
        return { good: true, response: parsed };
    }

    async getUsers() // query: PageDto,
    : Promise<TApiResp<TApiUsersResponse>> {
        // const { page = 1, take = 5, q = '' } = query;
        const users = await this.prisma.category.findMany({
            // where: { title: { contains: q } },
            orderBy: { title: 'asc' },
            // take,
            // skip: (page - 1) * take,
        });
        const parsed = UsersResponseSchema.parse(users);
        return { good: true, response: parsed };
    }

    async getOneUser(userId: string): Promise<TApiResp<TApiUserResponse>> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new UserNotFoundException();
        }
        const parsed = UserResponseSchema.parse(user);
        return { good: true, response: parsed };
    }

    async updateUser(
        userId: string,
        dto: UserUpdateDto,
    ): Promise<TApiResp<TApiUserResponse>> {
        await this.findUserById(userId);
        if (dto.phoneNumber) {
            await this.isPhoneNumberExist(dto.phoneNumber);
        }
        if (dto.password) {
            const hashedPassword = await generateHash(dto.password);
            dto.password = hashedPassword;
        }
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: {
                firstName: dto.firstName,
                secondName: dto.secondName,
                phoneNumber: dto.phoneNumber,
                password: dto.password,
            },
        });
        const parsed = UserResponseSchema.parse(user);
        return {
            good: true,
            response: parsed,
        };
    }

    async deleteUser(userId: string): Promise<TApiResp<true>> {
        await this.findUserById(userId);
        await this.prisma.user.delete({ where: { id: userId } });
        return { good: true };
    }

    private async findUserById(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new UserNotFoundException();
        }
        return user;
    }

    private async isPhoneNumberExist(phoneNumber: string) {
        const user = await this.prisma.user.findUnique({
            where: { phoneNumber: phoneNumber },
        });
        if (user) {
            throw new UserPhoneNumberAlreadyExistsException();
        }
    }
}
