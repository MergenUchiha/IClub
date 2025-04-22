import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoggerService } from 'src/utils/logger/logger.service';
import { UserTokenDto } from './dto/userToken.dto';
import { AdminTokenDto } from './dto/adminToken.dto';

@Injectable()
export class TokenService {
    constructor(
        private prismaService: PrismaService,
        private configService: ConfigService,
        private logger: LoggerService,
    ) {}

    generateTokens(payload: UserTokenDto) {
        const accessExpiresIn = parseInt(
            this.configService.getOrThrow<string>('JWT_ACCESS_TIME'),
            10,
        );

        const refreshExpiresIn = parseInt(
            this.configService.getOrThrow<string>('JWT_REFRESH_TIME'),
            10,
        );

        console.log(isNaN(accessExpiresIn) ? '1h' : accessExpiresIn);
        const accessToken = jwt.sign(
            payload,
            this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
            {
                expiresIn: isNaN(accessExpiresIn) ? '1h' : accessExpiresIn,
            },
        );

        const refreshToken = jwt.sign(
            payload,
            this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
            {
                expiresIn: isNaN(refreshExpiresIn) ? '30d' : refreshExpiresIn,
            },
        );

        this.logger.log(`Generated tokens for user with ID ${payload.id}`);

        return {
            accessToken,
            refreshToken,
        };
    }

    async saveTokens(userId: string, refreshToken: string) {
        const user = await this.prismaService.token.findFirst({
            where: { userId },
        });

        if (user) {
            this.logger.log(
                `Updating refresh token for user with ID ${userId}`,
            );
            const updateExistingToken = await this.prismaService.token.update({
                where: { userId: userId },
                data: { refreshToken },
            });
            return updateExistingToken;
        }

        this.logger.log(`Saving refresh token for user with ID ${userId}`);
        const token = this.prismaService.token.create({
            data: { refreshToken: refreshToken, userId },
        });
        return token;
    }

    validateAccessToken(accessToken: string) {
        try {
            const token = jwt.verify(
                accessToken,
                this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
            );

            this.logger.log(`Validated access token`);

            return token as UserTokenDto;
        } catch (err: any) {
            this.logger.error(
                `Failed to validate access token: ${err.message}`,
                err.stack,
                'TokenService',
            );
            throw new UnauthorizedException();
        }
    }

    validateRefreshToken(refreshToken: string) {
        try {
            const token = jwt.verify(
                refreshToken,
                this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
            );

            this.logger.log(`Validated refresh token`);

            return token as UserTokenDto;
        } catch (err: any) {
            this.logger.error(
                `Failed to validate refresh token: ${err.message}`,
                err.stack,
                'TokenService',
            );
            throw new UnauthorizedException('Invalid token!');
        }
    }

    async deleteToken(refreshToken: string) {
        const token = await this.findToken(refreshToken);

        if (!token) {
            throw new NotFoundException('Refresh token not found!');
        }

        this.logger.log(`Deleting refresh token`);
        await this.prismaService.token.delete({
            where: { id: token.id },
        });
        return { message: 'Token deleted successfully.' };
    }

    async findToken(refreshToken: string) {
        const token = await this.prismaService.token.findFirst({
            where: { refreshToken: refreshToken },
        });
        if (!token) throw new UnauthorizedException('Token not found!');
        return token;
    }

    async findTokenByUserId(userId: string) {
        const token = await this.prismaService.token.findFirst({
            where: { userId: userId },
        });
        if (!token) throw new UnauthorizedException('Token not found!');
        return token;
    }

    generateAdminTokens(payload: AdminTokenDto) {
        const accessExpiresIn = parseInt(
            this.configService.getOrThrow<string>('JWT_ACCESS_TIME'),
            10,
        );

        const refreshExpiresIn = parseInt(
            this.configService.getOrThrow<string>('JWT_REFRESH_TIME'),
            10,
        );

        console.log(isNaN(accessExpiresIn) ? '1h' : accessExpiresIn);
        const accessToken = jwt.sign(
            payload,
            this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
            {
                expiresIn: isNaN(accessExpiresIn) ? '1h' : accessExpiresIn,
            },
        );

        const refreshToken = jwt.sign(
            payload,
            this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
            {
                expiresIn: isNaN(refreshExpiresIn) ? '30d' : refreshExpiresIn,
            },
        );

        this.logger.log(`Generated tokens for user with ID ${payload.id}`);

        return {
            accessToken,
            refreshToken,
        };
    }

    async saveAdminTokens(adminId: string, refreshToken: string) {
        const user = await this.prismaService.token.findFirst({
            where: { adminId },
        });

        if (user) {
            this.logger.log(
                `Updating refresh token for user with ID ${adminId}`,
            );
            const updateExistingToken = await this.prismaService.token.update({
                where: { adminId: adminId },
                data: { refreshToken },
            });
            return updateExistingToken;
        }

        this.logger.log(`Saving refresh token for user with ID ${adminId}`);
        const token = this.prismaService.token.create({
            data: { refreshToken: refreshToken, adminId },
        });
        return token;
    }

    validateAdminAccessToken(accessToken: string) {
        try {
            const token = jwt.verify(
                accessToken,
                this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
            );

            this.logger.log(`Validated access token`);

            return token as UserTokenDto;
        } catch (err: any) {
            this.logger.error(
                `Failed to validate access token: ${err.message}`,
                err.stack,
                'TokenService',
            );
            throw new UnauthorizedException();
        }
    }

    validateAdminRefreshToken(refreshToken: string) {
        try {
            const token = jwt.verify(
                refreshToken,
                this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
            );

            this.logger.log(`Validated refresh token`);

            return token as UserTokenDto;
        } catch (err: any) {
            this.logger.error(
                `Failed to validate refresh token: ${err.message}`,
                err.stack,
                'TokenService',
            );
            throw new UnauthorizedException('Invalid token!');
        }
    }

    async deleteAdminToken(refreshToken: string) {
        const token = await this.findToken(refreshToken);

        if (!token) {
            throw new NotFoundException('Refresh token not found!');
        }

        this.logger.log(`Deleting refresh token`);
        await this.prismaService.token.delete({
            where: { id: token.id },
        });
        return { message: 'Token deleted successfully.' };
    }

    async findAdminToken(refreshToken: string) {
        const token = await this.prismaService.token.findFirst({
            where: { refreshToken: refreshToken },
        });
        if (!token) throw new UnauthorizedException('Token not found!');
        return token;
    }

    async findAdminTokenByAdminId(adminId: string) {
        const token = await this.prismaService.token.findFirst({
            where: { adminId: adminId },
        });
        if (!token) throw new UnauthorizedException('Token not found!');
        return token;
    }
}
