import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { AdminAuthService } from './admin.auth.service';
import { AdminLoginOperation } from './decorator/adminLoginOperation.decorator';
import { AdminLoginDto, TApiAdminAuthTokenResponse } from 'src/libs/contracts';
import { TApiResp } from 'src/libs/contracts/interface';
import { AdminRefreshOperation } from './decorator/adminRefreshOperation.decorator';
import { Cookies } from 'src/common/decorators/getCookie.decorator';
import { AdminLogoutOperation } from './decorator/adminLogoutOperation.decorator';

@Controller('auth/admin')
export class AdminAuthController {
    constructor(private adminAuthService: AdminAuthService) {}

    @AdminLoginOperation()
    @HttpCode(200)
    @Post('login')
    async login(
        @Body() dto: AdminLoginDto,
    ): Promise<TApiResp<TApiAdminAuthTokenResponse>> {
        return await this.adminAuthService.login(dto);
    }

    @AdminRefreshOperation()
    @Get('refresh')
    async refresh(
        @Cookies('refreshToken') refreshToken: string,
    ): Promise<TApiResp<TApiAdminAuthTokenResponse>> {
        return await this.adminAuthService.refresh(refreshToken);
    }

    @AdminLogoutOperation()
    @HttpCode(200)
    @Post('logout')
    async logout(
        @Cookies('refreshToken') refreshToken: string,
    ): Promise<TApiResp<true>> {
        return await this.adminAuthService.logout(refreshToken);
    }
}
