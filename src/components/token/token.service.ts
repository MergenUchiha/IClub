import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoggerService } from 'src/utils/logger/logger.service';
import { AdminTokenDto } from './dto/adminToken.dto';
import { UserTokenDto } from './dto/userToken.dto';

type TokenPair = { accessToken: string; refreshToken: string };

@Injectable()
export class TokenService {
    constructor(
        private prismaService: PrismaService,
        private configService: ConfigService,
        private logger: LoggerService,
    ) {}

    generateTokens(payload: UserTokenDto): TokenPair {
        return this.signPair(payload, {
            accessSecret: 'JWT_ACCESS_SECRET',
            accessTime: 'JWT_ACCESS_TIME',
            refreshSecret: 'JWT_REFRESH_SECRET',
            refreshTime: 'JWT_REFRESH_TIME',
        });
    }

    generateAdminTokens(payload: AdminTokenDto): TokenPair {
        return this.signPair(payload, {
            accessSecret: 'JWT_ADMIN_ACCESS_SECRET',
            accessTime: 'JWT_ADMIN_ACCESS_TIME',
            refreshSecret: 'JWT_ADMIN_REFRESH_SECRET',
            refreshTime: 'JWT_ADMIN_REFRESH_TIME',
        });
    }

    validateAccessToken(accessToken: string): UserTokenDto {
        return this.verify(accessToken, 'JWT_ACCESS_SECRET', 'access');
    }

    validateRefreshToken(refreshToken: string): UserTokenDto {
        return this.verify(refreshToken, 'JWT_REFRESH_SECRET', 'refresh');
    }

    validateAdminAccessToken(accessToken: string): UserTokenDto {
        return this.verify(accessToken, 'JWT_ADMIN_ACCESS_SECRET', 'access');
    }

    validateAdminRefreshToken(refreshToken: string): UserTokenDto {
        return this.verify(refreshToken, 'JWT_ADMIN_REFRESH_SECRET', 'refresh');
    }

    async saveTokens(userId: string, refreshToken: string) {
        return this.prismaService.token.upsert({
            where: { userId },
            update: { refreshToken: hashToken(refreshToken) },
            create: { userId, refreshToken: hashToken(refreshToken) },
        });
    }

    async saveAdminTokens(adminId: string, refreshToken: string) {
        return this.prismaService.token.upsert({
            where: { adminId },
            update: { refreshToken: hashToken(refreshToken) },
            create: { adminId, refreshToken: hashToken(refreshToken) },
        });
    }

    async findToken(refreshToken: string) {
        const token = await this.prismaService.token.findUnique({
            where: { refreshToken: hashToken(refreshToken) },
        });
        if (!token) throw new UnauthorizedException('Token not found!');
        return token;
    }

    async findTokenByUserId(userId: string) {
        const token = await this.prismaService.token.findUnique({
            where: { userId },
        });
        if (!token) throw new UnauthorizedException('Token not found!');
        return token;
    }

    async findAdminTokenByAdminId(adminId: string) {
        const token = await this.prismaService.token.findUnique({
            where: { adminId },
        });
        if (!token) throw new UnauthorizedException('Token not found!');
        return token;
    }

    async deleteToken(refreshToken: string) {
        const token = await this.findToken(refreshToken);
        await this.prismaService.token.delete({ where: { id: token.id } });
        return { message: 'Token deleted successfully.' };
    }

    private signPair(
        payload: UserTokenDto | AdminTokenDto,
        keys: {
            accessSecret: string;
            accessTime: string;
            refreshSecret: string;
            refreshTime: string;
        },
    ): TokenPair {
        const accessToken = jwt.sign(
            { ...payload },
            this.configService.getOrThrow<string>(keys.accessSecret),
            { expiresIn: this.lifetime(keys.accessTime) },
        );

        const refreshToken = jwt.sign(
            { ...payload },
            this.configService.getOrThrow<string>(keys.refreshSecret),
            { expiresIn: this.lifetime(keys.refreshTime) },
        );

        this.logger.log(`Generated tokens for subject ${payload.id}`);

        return { accessToken, refreshToken };
    }

    /**
     * Lifetimes are configured in the zeit/ms format ('15m', '1d', '30d') and
     * are handed to jsonwebtoken untouched. Parsing them as integers used to
     * turn '30d' into 30 seconds.
     */
    private lifetime(key: string): jwt.SignOptions['expiresIn'] {
        return this.configService.getOrThrow<string>(
            key,
        ) as jwt.SignOptions['expiresIn'];
    }

    private verify(
        token: string,
        secretKey: string,
        kind: 'access' | 'refresh',
    ): UserTokenDto {
        try {
            return jwt.verify(
                token,
                this.configService.getOrThrow<string>(secretKey),
            ) as UserTokenDto;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'unknown';
            this.logger.warn(
                `Rejected ${kind} token: ${message}`,
                'TokenService',
            );
            throw new UnauthorizedException('Invalid token!');
        }
    }
}

/**
 * Refresh tokens are stored as digests: a dump of the tokens table is then
 * not enough to impersonate anybody. Lookups hash the incoming token the
 * same way, so the unique index still does the work.
 */
function hashToken(refreshToken: string): string {
    return createHash('sha256').update(refreshToken).digest('hex');
}
