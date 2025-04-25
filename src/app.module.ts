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

@Module({
    imports: [
        SentryModule.forRoot(),
        ConfigModule.forRoot({
            envFilePath: `.env`,
            validate: validateEnv,
            isGlobal: true,
            cache: true,
        }),
        TerminusModule.forRoot(),
        LoggerModule,
        HealthModule,
        PrismaModule,
        TokenModule,
        MinioModule,
        MediaModule,
        CategoryModule,
        ProductModule,
        AdminAuthModule,
        DataInitModule,
        UserModule,
        UserAuthModule,
        OrderModule,
        BookingModule,
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
    configure() {}
    async onModuleInit() {
        await this.dataInitService.onModuleInit();
    }
}
