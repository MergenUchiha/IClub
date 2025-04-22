import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { TApiUserAuthTokenResponse, UserLoginDto } from 'src/libs/contracts';
import { TApiResp } from 'src/libs/contracts/interface';
import { UserAuthService } from './user.auth.service';
import { Cookies } from 'src/common/decorators/getCookie.decorator';
import { UserLogoutOperation } from './decorator/userLogoutOperation.decorator';
import { UserRefreshOperation } from './decorator/userRefreshOperation.decorator';
import { UserLoginOperation } from './decorator/userLoginOperation.decorator';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';
import { UserTokenDto } from 'src/components/token/dto/userToken.dto';
import { GetMeOperation } from './decorator/getMeOperation.decorator';

@Controller('auth/user')
export class UserAuthController {
    constructor(private userAuthService: UserAuthService) {}
    @UserLoginOperation()
    @HttpCode(200)
    @Post('login')
    async login(
        @Body() dto: UserLoginDto,
    ): Promise<TApiResp<TApiUserAuthTokenResponse>> {
        return await this.userAuthService.login(dto);
    }

    @UserRefreshOperation()
    @Get('refresh')
    async refresh(
        @Cookies('refreshToken') refreshToken: string,
    ): Promise<TApiResp<TApiUserAuthTokenResponse>> {
        return await this.userAuthService.refresh(refreshToken);
    }

    @UserLogoutOperation()
    @HttpCode(200)
    @Post('logout')
    async logout(
        @Cookies('refreshToken') refreshToken: string,
    ): Promise<TApiResp<true>> {
        return await this.userAuthService.logout(refreshToken);
    }

    @GetMeOperation()
    @Get('me')
    async getMe(@CurrentUser() currentUser: UserTokenDto) {
        return await this.userAuthService.getMe(currentUser);
    }
}
