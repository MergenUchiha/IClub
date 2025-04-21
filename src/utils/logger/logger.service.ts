import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { existsSync, mkdirSync } from 'fs';
import * as path from 'path';
import * as winston from 'winston';

@Injectable()
export class LoggerService {
    private logger: winston.Logger;
    private logsDir = path.resolve(__dirname, '..', '..', 'logs');

    constructor(private readonly configService: ConfigService) {
        const environment = configService.get<string>('NODE_ENV');
        let logLevel = 'debug';

        if (environment === 'production') {
            logLevel = 'warn';
        } else if (environment === 'test') {
            logLevel = 'warn';
        } else {
            logLevel = 'debug';
        }

        this.logger = winston.createLogger({
            level: logLevel,
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
            ),
            transports: [
                new winston.transports.Console({
                    level: logLevel,
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.simple(),
                    ),
                }),
            ],
        });

        // this.logger.add(
        //     new WinstonTelegram({
        //         token: configService.getOrThrow<string>(
        //             'LOGGER_TELEGRAM_BOT_TOKEN',
        //         ),
        //         chatId: configService.getOrThrow<number>(
        //             'LOGGER_TELEGRAM_CHAT_ID',
        //         ),
        //         level: 'debug',
        //         parseMode: 'MarkdownV2',
        //         silent: true,
        //         handleExceptions: true,
        //     }),
        // );

        if (environment === 'production' || environment === 'test') {
            if (!existsSync(this.logsDir)) {
                mkdirSync(this.logsDir, { recursive: true });
            }

            this.logger.add(
                new winston.transports.File({
                    filename: path.join(this.logsDir, 'production.log'),
                }),
            );
        }
    }

    log(message: string, context?: string) {
        this.logger.info(message, { context });
    }

    error(message: string, trace: string, context?: string) {
        this.logger.error(message, { trace, context });
    }

    warn(message: string, context?: string) {
        this.logger.warn(message, { context });
    }

    debug(message: string, context?: string) {
        this.logger.debug(message, { context });
    }

    verbose(message: string, context?: string) {
        this.logger.verbose(message, { context });
    }
}
