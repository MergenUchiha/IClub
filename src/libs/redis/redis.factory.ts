import { FactoryProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

export const redisClientFactory: FactoryProvider<Redis> = {
    provide: 'RedisClient',
    useFactory: (configService: ConfigService) => {
        const redisInstance = new Redis({
            host: configService.get<string>('REDIS_HOST'),
            port: configService.get<number>('REDIS_PORT'),
            password: configService.getOrThrow<string>('REDIS_PASSWORD'),
        });

        redisInstance.on('error', (error) => {
            console.error(`Redis Error: ${error.message}`);
        });
        redisInstance.on('connect', () => {
            console.log('Redis connected successfully');
        });
        redisInstance.on('ready', () => {
            console.log('Redis is ready to use');
        });

        return redisInstance;
    },
    inject: [ConfigService],
};
