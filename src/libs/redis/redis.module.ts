import { Global, Module } from '@nestjs/common';
import { redisClientFactory } from './redis.factory';
import { RedisRepository } from './redis.repository';
import { RedisService } from './redis.service';

@Global()
@Module({
    providers: [RedisService, RedisRepository, redisClientFactory],
    exports: [RedisService],
})
export class RedisModule {}
