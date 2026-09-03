import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserTokenDto } from 'src/components/token/dto/userToken.dto';
import { TokenService } from 'src/components/token/token.service';
import { verifyHash } from 'src/helpers/providers/generateHash';
import {
    TApiUserAuthTokenResponse,
    TApiUserResponse,
    UserLoginDto,
    UserResponseSchema,
} from 'src/libs/contracts';
import { UserNotFoundException } from 'src/libs/contracts/exceptions';
import { TApiResp } from 'src/libs/contracts/interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserAuthService {
    constructor(
        private tokenService: TokenService,
        private prisma: PrismaService,
    ) {}

    async login(
        dto: UserLoginDto,
    ): Promise<TApiResp<TApiUserAuthTokenResponse>> {
        // A wrong phone number and a wrong password produce the same answer,
        // so the endpoint cannot be used to enumerate accounts.
        const user = await this.prisma.user.findUnique({
            where: { phoneNumber: dto.phoneNumber },
        });
        const isPasswordValid =
            user !== null && (await verifyHash(dto.password, user.password));
        if (!user || !isPasswordValid) {
            throw new UnauthorizedException('Invalid phone number or password');
        }
        const tokens = this.tokenService.generateTokens({
            ...new UserTokenDto(user),
        });
        await this.tokenService.saveTokens(user.id, tokens.refreshToken);

        return {
            good: true,
            response: {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                id: user.id,
                isTeacher: user.isTeacher,
                firstName: user.firstName,
                secondName: user.secondName,
                phoneNumber: user.phoneNumber,
            },
        };
    }

    async refresh(
        refreshToken: string,
    ): Promise<TApiResp<TApiUserAuthTokenResponse>> {
        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token not provided');
        }

        // The signature proves the token was issued by us; the database row
        // proves it has not been rotated away or revoked by a logout.
        const payload = this.tokenService.validateRefreshToken(refreshToken);
        const storedToken = await this.tokenService.findToken(refreshToken);
        if (storedToken.userId !== payload.id) {
            throw new UnauthorizedException('Invalid token!');
        }

        const user = await this.findUserById(payload.id);

        const tokens = this.tokenService.generateTokens({
            ...new UserTokenDto(user),
        });
        await this.tokenService.saveTokens(user.id, tokens.refreshToken);
        return {
            good: true,
            response: {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                id: user.id,
                isTeacher: user.isTeacher,
                firstName: user.firstName,
                secondName: user.secondName,
                phoneNumber: user.phoneNumber,
            },
        };
    }

    async logout(refreshToken: string): Promise<TApiResp<true>> {
        if (!refreshToken) {
            throw new UnauthorizedException('User unauthorized!');
        }
        await this.tokenService.deleteToken(refreshToken);
        return {
            good: true,
        };
    }

    async getMe(
        currentUser: UserTokenDto,
    ): Promise<TApiResp<TApiUserResponse>> {
        const user = await this.findUserById(currentUser.id);
        const parsed = UserResponseSchema.parse(user);
        return {
            good: true,
            response: parsed,
        };
    }

    private async findUserById(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: id },
        });
        if (!user) {
            throw new UserNotFoundException();
        }
        return user;
    }

}
