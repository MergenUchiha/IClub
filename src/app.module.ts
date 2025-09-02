import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { TerminusModule } from '@nestjs/terminus';
import { SentryModule } from '@sentry/nestjs/setup';
import { AuthGuard } from './common/guards/auth.guard';
import { LoggingInterceptor } from './common/interceptors/logger.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { validateEnv } from './config/env.validation';
import { PrismaModule } from './prisma/prisma.module';
import { AllExceptionsFilter } from './utils/core/allException.filter';
import { HealthModule } from './utils/health/health.module';
import { LoggerModule } from './utils/logger/logger.module';
import { MediaModule } from './libs/media/media.module';
import { TokenModule } from './components/token/token.module';
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod';
import { CategoryModule } from './components/category/category.module';
import { ProductModule } from './components/product/product.module';
import { AdminAuthModule } from './components/auth/admin/admin.auth.module';
import { DataInitModule } from './components/data-init/data-init.module';
import { DataInitService } from './components/data-init/data-init.service';
import { UserModule } from './components/user/user.module';
import { UserAuthModule } from './components/auth/user/user.auth.module';
import { OrderModule } from './components/order/order.module';
import { BookingModule } from './components/booking/booking.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { StaticFileMiddleware } from './common/middlewares/static.middleware';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';

// 🔑 Исправление: импортируем ioredis
import Redis from 'ioredis';

@Module({
    imports: [
        SentryModule.forRoot(),
        ConfigModule.forRoot({
            envFilePath: `.env`,
            validate: validateEnv,
            isGlobal: true,
            cache: true,
        }),
        // ⚡ Throttler только для production
        ...(process.env.NODE_ENV === 'production'
            ? [
                  ThrottlerModule.forRootAsync({
                      imports: [ConfigModule],
                      inject: [ConfigService],
                      useFactory: (configService: ConfigService) => {
                          const redis: Redis = new Redis({
                              host: configService.getOrThrow<string>(
                                  'REDIS_HOST',
                              ),
                              port: configService.getOrThrow<number>(
                                  'REDIS_PORT',
                              ),
                              password:
                                  configService.getOrThrow<string>(
                                      'REDIS_PASSWORD',
                                  ),
                          });

                          return {
                              throttlers: [
                                  {
                                      limit: configService.getOrThrow<number>(
                                          'RATE_LIMIT_LIMIT',
                                      ),
                                      ttl: configService.getOrThrow<number>(
                                          'RATE_LIMIT_TTL',
                                      ),
                                  },
                              ],
                              storage: new ThrottlerStorageRedisService(redis),
                          };
                      },
                  }),
              ]
            : []),
        TerminusModule.forRoot(),
        LoggerModule,
        HealthModule,
        PrismaModule,
        TokenModule,
        MediaModule,
        CategoryModule,
        ProductModule,
        AdminAuthModule,
        DataInitModule,
        UserModule,
        UserAuthModule,
        OrderModule,
        BookingModule,
        ServeStaticModule.forRoot({
            rootPath: join(process.cwd(), 'Uploads'), // Используем process.cwd() для надежности
            serveRoot: '/Uploads',
            serveStaticOptions: {
                redirect: false,
                index: false,
                cacheControl: false, // Отключаем кэширование для новых файлов
            },
        }),
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
        DataInitService,
    ],
})
export class AppModule {
    constructor(private readonly dataInitService: DataInitService) {}

    configure(consumer: MiddlewareConsumer) {
        consumer.apply(StaticFileMiddleware).forRoutes('/Uploads/*'); // Уточняем маршруты
    }

    async onModuleInit() {
        await this.dataInitService.onModuleInit();
    }
}
