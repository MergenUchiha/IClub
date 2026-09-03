// Must run before anything else so Sentry can instrument the libraries below.
import './instrument';

import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';
import fastifyHelmet from '@fastify/helmet';
import fastifyMultipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { patchNestJsSwagger, ZodValidationPipe } from 'nestjs-zod';
import { promises as fs } from 'fs';
import { join } from 'path';
import 'reflect-metadata';

import { AppModule } from './app.module';
import { getCorsOptions } from './helpers/constants/corsOrigin';
import { LoggerService } from './utils/logger/logger.service';

async function bootstrap() {
    patchNestJsSwagger();

    const uploadDir = join(process.cwd(), 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });

    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter(),
        { bufferLogs: true },
    );

    const logger = app.get(LoggerService);
    app.useLogger(logger);

    const configService = app.get(ConfigService);
    const port = configService.getOrThrow<number>('PORT');
    const isProduction =
        configService.getOrThrow<string>('NODE_ENV') === 'production';

    await app.register(fastifyHelmet);
    await app.register(
        fastifyCors,
        getCorsOptions(
            configService.getOrThrow<string>('CORS_ORIGINS'),
            isProduction,
        ),
    );
    await app.register(fastifyMultipart);
    await app.register(fastifyCookie, {
        secret: configService.getOrThrow<string>('COOKIE_SECRET'),
    });

    // Uploaded images are served straight from disk. The prefix is lowercase
    // everywhere: on a case-sensitive filesystem '/Uploads' would 404.
    await app.register(fastifyStatic, {
        root: uploadDir,
        prefix: '/uploads/',
        decorateReply: false,
        cacheControl: false,
    });

    app.useGlobalPipes(new ZodValidationPipe());
    app.useGlobalInterceptors(
        new ClassSerializerInterceptor(app.get(Reflector)),
    );

    app.setGlobalPrefix('api');

    // The API reference exposes every route and payload shape, so it stays
    // behind an explicit flag that defaults to off.
    if (configService.getOrThrow<boolean>('IS_SWAGGER_ENABLED')) {
        const config = new DocumentBuilder()
            .setTitle('IClub API')
            .setDescription(
                'Bookings, orders and catalogue for the IClub student club',
            )
            .setVersion('1.0')
            .addBearerAuth()
            .build();

        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('docs', app, document);
        logger.log('Swagger UI is served at /docs', 'Bootstrap');
    }

    await app.listen(port, '0.0.0.0');
    logger.log(`Server is listening on port ${port}`, 'Bootstrap');
}

void bootstrap();
