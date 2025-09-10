import fastifyCookie from '@fastify/cookie';
import fastifyCsrfProtection from '@fastify/csrf-protection';
import fastifyHelmet from '@fastify/helmet';
import multipart from '@fastify/multipart';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { patchNestJsSwagger, ZodValidationPipe } from 'nestjs-zod';
import 'reflect-metadata';
import { AppModule } from './app.module';
import './instrument';
import { LoggerService } from './utils/logger/logger.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import fastifyCors from '@fastify/cors';
import { join } from 'path';
import { promises as fs } from 'fs';

async function bootstrap() {
    patchNestJsSwagger();

    // Создаем папку uploads перед запуском
    const uploadDir = join(process.cwd(), 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });

    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter(),
        {
            bufferLogs: true,
        },
    );

    const logger = app.get(LoggerService);
    app.useLogger(logger);

    const configService = app.get(ConfigService);
    const port = configService.getOrThrow<number>('PORT');

    // Настройка Swagger
    if (configService.getOrThrow<boolean>('IS_SWAGGER_ENABLED')) {
        const config = new DocumentBuilder()
            .setTitle('IClub API')
            .setDescription('API документация для IClub')
            .setVersion('1.0')
            .addBearerAuth()
            .build();

        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('docs', app, document);
    }

    // Регистрация Fastify плагинов
    await app.register(fastifyHelmet);
    await app.register(fastifyCsrfProtection, { cookieOpts: { signed: true } });
    await app.register(fastifyCors, {
        credentials: true,
        origin: '*', // Можно уточнить домен фронтенда в продакшене
    });
    await app.register(multipart);
    await app.register(fastifyCookie, {
        secret: configService.getOrThrow<string>('COOKIE_SECRET'),
    });

    // Регистрируем @fastify/static для обслуживания файлов из uploads
    await app.register(require('@fastify/static'), {
        root: join(process.cwd(), 'uploads'),
        prefix: '/uploads',
        decorateReply: false, // Избегаем конфликтов с NestJS
        cacheControl: false, // Отключаем кэширование для динамических файлов
    });

    // Глобальные пайпы и интерсепторы
    app.useGlobalPipes(new ZodValidationPipe());
    app.useGlobalInterceptors(
        new ClassSerializerInterceptor(app.get(Reflector)),
    );

    // Устанавливаем глобальный префикс API
    app.setGlobalPrefix('api');

    await app.listen(port, '0.0.0.0', () => {
        console.log(`Your server is listening on port ${port}`);
    });
}

bootstrap();
