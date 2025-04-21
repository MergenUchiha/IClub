import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RedisModule } from 'src/libs/redis/redis.module';
import { TokenModule } from 'src/components/token/token.module';

@Module({
    imports: [RedisModule, TokenModule],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
