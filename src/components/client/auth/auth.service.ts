import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { UserTokenDto } from 'src/components/token/dto/userToken.dto';
import { TokenService } from 'src/components/token/token.service';
import { generateHash, verifyHash } from 'src/helpers/providers/generateHash';
import { generateVerificationPhoneNumberCodeAndExpiry } from 'src/helpers/providers/generateVerificationPhoneNumberCodeAndExpiry';
import {
    TApiUserAuthTokenResponse,
    TApiUserResponse,
    UserLoginDto,
    UserRegistrationDto,
    UserResponseSchema,
    UserVerificationDto,
} from 'src/libs/contracts';
import {
    UserNotFoundException,
    UserPhoneNumberAlreadyExistsException,
    UserWrongPasswordAlreadyExistsException,
} from 'src/libs/contracts/exceptions';
import { TApiResp } from 'src/libs/contracts/interface';
import { RedisService } from 'src/libs/redis/redis.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private redis: RedisService,
        private tokenService: TokenService,
    ) {}

    async userRegistration(
        dto: UserRegistrationDto,
    ): Promise<TApiResp<TApiUserResponse>> {
        await this.isPhoneNumberExist(dto.phoneNumber);
        const hashedPassword = await generateHash(dto.password);
        dto.password = hashedPassword;
        const user = await this.prisma.user.create({ data: dto });
        const { code, expiry } = generateVerificationPhoneNumberCodeAndExpiry();
        await this.redis.setWithExpiry(
            'phoneNumberVerification',
            `${user.id}:${user.phoneNumber}`,
            code,
            +expiry,
        );

        const parsed = UserResponseSchema.parse(user);

        return { good: true, response: parsed };
    }

    async userLogin(
        dto: UserLoginDto,
    ): Promise<TApiResp<TApiUserAuthTokenResponse>> {
        const user = await this.findUserByPhoneNumber(dto.phoneNumber);
        const isPasswordCorrect = await verifyHash(dto.password, user.password);
        if (!user.isVerified) {
            throw new ForbiddenException('User is not verified');
        }
        if (!isPasswordCorrect) {
            throw new UserWrongPasswordAlreadyExistsException();
        }
        const tokens = this.tokenService.generateTokens(new UserTokenDto(user));

        await this.tokenService.saveTokens(user.id, tokens.refreshToken);
        return {
            good: true,
            response: { id: user.id, phoneNumber: user.phoneNumber, ...tokens },
        };
    }

    async userRefreshToken(
        refreshToken: string,
    ): Promise<TApiResp<TApiUserAuthTokenResponse>> {
        if (!refreshToken) {
            throw new UnauthorizedException('Invalid token!');
        }

        const tokenFromDB = await this.tokenService.findToken(refreshToken);
        const validToken = this.tokenService.validateRefreshToken(refreshToken);

        if (!validToken || !tokenFromDB) {
            throw new UnauthorizedException('Invalid token!');
        }

        const user = await this.findUserById(validToken.id);

        const tokens = this.tokenService.generateTokens({
            ...new UserTokenDto(user),
        });

        await this.tokenService.saveTokens(user.id, tokens.refreshToken);

        return {
            good: true,
            response: { id: user.id, phoneNumber: user.phoneNumber, ...tokens },
        };
    }

    async userLogout(refreshToken: string): Promise<TApiResp<true>> {
        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token not provided');
        }

        await this.tokenService.deleteToken(refreshToken);

        return { good: true };
    }

    async userVerification(
        userId: string,
        dto: UserVerificationDto,
    ): Promise<TApiResp<true>> {
        const user = await this.findUserById(userId);
        if (user.isVerified) {
            throw new ConflictException('User already has been verified!');
        }
        await this.validateVerificationPhoneNumberCode(
            dto,
            user.id,
            user.phoneNumber,
        );
        await this.prisma.user.update({
            where: { id: userId },
            data: { isVerified: true },
        });
        return { good: true };
    }

    async userResendVerificationCode(userId: string): Promise<TApiResp<true>> {
        const user = await this.findUserById(userId);
        if (user.isVerified) {
            throw new ConflictException('User already has been verified!');
        }
        const { code, expiry } = generateVerificationPhoneNumberCodeAndExpiry();
        await this.redis.setWithExpiry(
            'phoneNumberVerification',
            `${user.id}:${user.phoneNumber}`,
            code,
            +expiry,
        );
        return { good: true };
    }

    private async validateVerificationPhoneNumberCode(
        dto: UserVerificationDto,
        userId: string,
        userPhoneNumber: string,
    ): Promise<void> {
        const key = `${userId}:${userPhoneNumber}`;
        const verificationPhoneNumberCode = await this.redis.get(
            'phoneNumberVerification',
            key,
        );
        if (verificationPhoneNumberCode !== dto.code) {
            throw new BadRequestException('Verification code is wrong');
        }
        await this.redis.delete('phoneNumberVerification', key);
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

    private async findUserByPhoneNumber(phoneNumber: string) {
        const user = await this.prisma.user.findUnique({
            where: { phoneNumber: phoneNumber },
        });
        if (!user) throw new UserNotFoundException();
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
