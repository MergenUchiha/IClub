import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
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
        const user = await this.findUserByPhoneNumber(dto.phoneNumber);
        const isPasswordValid = await verifyHash(dto.password, user.password);
        if (!isPasswordValid) {
            throw new BadRequestException('Password incorrect!');
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

        const tokenFromDB = await this.tokenService.findToken(refreshToken);
        const isTokenValid =
            this.tokenService.validateRefreshToken(refreshToken);
        if (!isTokenValid && !tokenFromDB) {
            throw new UnauthorizedException('Invalid token!');
        }
        const user = await this.findUserById(isTokenValid.id);

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

    private async findUserByPhoneNumber(phoneNumber: string) {
        const user = await this.prisma.user.findUnique({
            where: { phoneNumber: phoneNumber },
        });
        if (!user) {
            throw new UserNotFoundException();
        }
        return user;
    }
}
