import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { AdminTokenDto } from 'src/components/token/dto/adminToken.dto';
import { TokenService } from 'src/components/token/token.service';
import { verifyHash } from 'src/helpers/providers/generateHash';
import { AdminLoginDto, TApiAdminAuthTokenResponse } from 'src/libs/contracts';
import { TApiResp } from 'src/libs/contracts/interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminAuthService {
    constructor(
        private tokenService: TokenService,
        private prisma: PrismaService,
    ) {}

    async login(
        dto: AdminLoginDto,
    ): Promise<TApiResp<TApiAdminAuthTokenResponse>> {
        // A wrong username and a wrong password produce the same answer, so
        // the endpoint cannot be used to enumerate accounts.
        const admin = await this.prisma.admin.findUnique({
            where: { username: dto.username },
        });
        const isPasswordValid =
            admin !== null && (await verifyHash(dto.password, admin.password));
        if (!admin || !isPasswordValid) {
            throw new UnauthorizedException('Invalid username or password');
        }
        const tokens = this.tokenService.generateAdminTokens({
            ...new AdminTokenDto(admin),
        });
        await this.tokenService.saveAdminTokens(admin.id, tokens.refreshToken);

        return {
            good: true,
            response: { ...tokens },
        };
    }

    async refresh(
        refreshToken: string,
    ): Promise<TApiResp<TApiAdminAuthTokenResponse>> {
        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token not provided');
        }

        // The signature proves the token was issued by us; the database row
        // proves it has not been rotated away or revoked by a logout.
        const payload =
            this.tokenService.validateAdminRefreshToken(refreshToken);
        const storedToken = await this.tokenService.findToken(refreshToken);
        if (storedToken.adminId !== payload.id) {
            throw new UnauthorizedException('Invalid token!');
        }

        const admin = await this.findAdminById(payload.id);

        const tokens = this.tokenService.generateAdminTokens({
            ...new AdminTokenDto(admin),
        });
        await this.tokenService.saveAdminTokens(admin.id, tokens.refreshToken);
        return {
            good: true,
            response: { ...tokens },
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

    private async findAdminById(id: string) {
        const admin = await this.prisma.admin.findUnique({
            where: { id: id },
        });
        if (!admin) {
            throw new NotFoundException('Admin not found');
        }
        return admin;
    }
}
