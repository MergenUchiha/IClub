import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { LoggerService } from 'src/utils/logger/logger.service';
import { RedisRepository } from './redis.repository';

@Injectable()
export class RedisService {
    private tenMinutesInSeconds = 60 * 10;

    constructor(
        @Inject('RedisClient') private readonly redisClient: Redis,
        private readonly redisRepository: RedisRepository,
        private logger: LoggerService,
    ) {}

    getClient(): Redis {
        return this.redisClient;
    }

    async get(prefix: string, key: string): Promise<string | null> {
        this.logger.log(`Getting value for key: ${prefix}:${key}`);
        return this.redisRepository.get(prefix, key);
    }

    async mget(prefix: string, ...keys: string[]): Promise<(string | null)[]> {
        const redisKeys = keys.map((key) => `${prefix}:${key}`);
        this.logger.log(`Getting values for keys: ${redisKeys.join(', ')}`);
        return this.redisRepository.mget(...redisKeys);
    }

    async set(prefix: string, key: string, value: string): Promise<void> {
        this.logger.log(
            `Setting value for key: ${prefix}:${key} with value: ${value}`,
        );
        return this.redisRepository.set(prefix, key, value);
    }

    async delete(prefix: string, key: string): Promise<void> {
        this.logger.log(`Deleting key: ${prefix}:${key}`);
        return this.redisRepository.delete(prefix, key);
    }

    async setWithExpiry(
        prefix: string,
        key: string,
        value: string,
        expiry: number,
    ): Promise<void> {
        this.logger.log(
            `Setting value for key: ${prefix}:${key} with value: ${value} and expiry: ${expiry}`,
        );
        return this.redisRepository.setWithExpiry(prefix, key, value, expiry);
    }

    async getKeys(pattern: string): Promise<string[]> {
        this.logger.log(`Getting keys with pattern: ${pattern}`);
        return this.redisRepository.getKeys(pattern);
    }
}
