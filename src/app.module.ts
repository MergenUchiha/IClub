// import KeyvRedis from '@keyv/redis';
// import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { TerminusModule } from '@nestjs/terminus';
import { SentryModule } from '@sentry/nestjs/setup';
import { AuthGuard } from './common/guards/auth.guard';
import { LoggingInterceptor } from './common/interceptors/logger.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { validateEnv } from './config/env.validation';
import { MinioModule } from './libs/minio/minio.module';
import { RedisModule } from './libs/redis/redis.module';
import { PrismaModule } from './prisma/prisma.module';
import { AllExceptionsFilter } from './utils/core/allException.filter';
import { HealthModule } from './utils/health/health.module';
import { LoggerModule } from './utils/logger/logger.module';
import { MediaModule } from './libs/media/media.module';
import { TokenModule } from './components/token/token.module';
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod';

@Module({
    imports: [
        SentryModule.forRoot(),
        ConfigModule.forRoot({
            envFilePath: `.env`,
            validate: validateEnv,
            isGlobal: true,
            cache: true,
        }),
        // CacheModule.registerAsync({
        //     inject: [ConfigService],
        //     useFactory: async (configService: ConfigService) => {
        //         return {
        //             stores: [
        //                 new KeyvRedis(configService.getOrThrow('REDIS_URL')),
        //             ],
        //         };
        //     },
        // }),
        TerminusModule.forRoot(),
        LoggerModule,
        HealthModule,
        PrismaModule,
        RedisModule,
        TokenModule,
        MinioModule,
        MediaModule,
    ],
    providers: [
        {
            provide: APP_FILTER,
            useClass: AllExceptionsFilter,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: LoggingInterceptor,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: TimeoutInterceptor,
        },
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
        { provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor },
        {
            provide: APP_PIPE,
            useClass: ZodValidationPipe,
        },
    ],
})
export class AppModule {}
