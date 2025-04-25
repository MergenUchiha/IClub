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

async function bootstrap() {
    patchNestJsSwagger();
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

    // await cacheService.init();
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

    await app.register(fastifyHelmet);
    await app.register(fastifyCsrfProtection, { cookieOpts: { signed: true } });
    await app.register(fastifyCors, {
        // credentials: true,
        origin: `*`,
    });
    await app.register(multipart);
    await app.register(fastifyCookie, {
        secret: configService.getOrThrow<'string'>('COOKIE_SECRET'),
    });

    // app.use(compression());
    app.useGlobalPipes(new ZodValidationPipe());

    app.useGlobalInterceptors(
        new ClassSerializerInterceptor(app.get(Reflector)),
    );
    app.setGlobalPrefix('api');

    await app.listen(port, '0.0.0.0', () => {
        console.log(`Your server is listening on port ${port}`);
    });
}

bootstrap();
