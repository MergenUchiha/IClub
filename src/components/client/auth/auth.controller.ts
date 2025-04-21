import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
    UserLoginDto,
    UserRegistrationDto,
    UserVerificationDto,
} from 'src/libs/contracts';
import {
    TApiUserAuthTokenResponse,
    TApiUserResponse,
} from 'src/libs/contracts';
import { TApiResp } from 'src/libs/contracts/interface';
import { UserResendVerificationCodeOperation } from './decorator/userResendVerificationCodeOperation.decorator';
import { UserVerificationOperation } from './decorator/userVerificationOperation.decorator';
import { UserLogoutOperation } from './decorator/userLogoutOperation.decorator';
import { UserLoginOperation } from './decorator/userLoginOperation.decorator';
import { UserRegistrationOperation } from './decorator/userRegistrationOperation.decorator';
import { Cookies } from 'src/common/decorators/getCookie.decorator';
import { UserRefreshTokenOperation } from './decorator/userRefreshTokenOperation.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @UserRegistrationOperation()
    @Post('registration')
    async userRegistration(
        @Body() dto: UserRegistrationDto,
    ): Promise<TApiResp<TApiUserResponse>> {
        return await this.authService.userRegistration(dto);
    }

    @HttpCode(HttpStatus.OK)
    @UserLoginOperation()
    @Post('login')
    async login(
        @Body() dto: UserLoginDto,
    ): Promise<TApiResp<TApiUserAuthTokenResponse>> {
        return await this.authService.userLogin(dto);
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    @UserLogoutOperation()
    async userLogout(
        @Cookies('refreshToken') refreshToken: string,
    ): Promise<TApiResp<true>> {
        return await this.authService.userLogout(refreshToken);
    }

    @UserRefreshTokenOperation()
    @Get('refresh')
    async userRefreshToken(@Cookies('refreshToken') refreshToken: string) {
        return await this.authService.userRefreshToken(refreshToken);
    }

    @Patch('verification/:userId')
    @UserVerificationOperation()
    async userVerification(
        @Param('userId') userId: string,
        @Body() dto: UserVerificationDto,
    ): Promise<TApiResp<true>> {
        return await this.authService.userVerification(userId, dto);
    }

    @Post('resend-verification/:userId')
    @HttpCode(HttpStatus.OK)
    @UserResendVerificationCodeOperation()
    async userResendVerificationCode(
        @Param('userId') userId: string,
    ): Promise<TApiResp<true>> {
        return await this.authService.userResendVerificationCode(userId);
    }
}
