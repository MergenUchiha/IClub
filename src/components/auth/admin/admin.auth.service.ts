import {
    BadRequestException,
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
        const admin = await this.findAdminByUsername(dto.username);
        const isPasswordValid = await verifyHash(dto.password, admin.password);
        if (!isPasswordValid) {
            throw new BadRequestException('Password incorrect!');
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

        const tokenFromDB =
            await this.tokenService.findAdminToken(refreshToken);
        const isTokenValid =
            this.tokenService.validateAdminRefreshToken(refreshToken);
        if (!isTokenValid && !tokenFromDB) {
            throw new UnauthorizedException('Invalid token!');
        }
        const admin = await this.findAdminById(isTokenValid.id);

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
        await this.tokenService.deleteAdminToken(refreshToken);
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

    private async findAdminByUsername(username: string) {
        const admin = await this.prisma.admin.findUnique({
            where: { username: username },
        });
        if (!admin) {
            throw new NotFoundException('Admin not found');
        }
        return admin;
    }
}
