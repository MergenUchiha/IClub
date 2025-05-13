import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { join } from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class StaticFileMiddleware implements NestMiddleware {
    private readonly logger = new Logger(StaticFileMiddleware.name);

    async use(req: FastifyRequest, res: FastifyReply, next: () => void) {
        const url = req.url;
        if (!url) {
            this.logger.warn('Request URL is undefined');
            return next();
        }

        if (url.startsWith('/uploads/')) {
            const filePath = join(
                process.cwd(),
                'uploads',
                url.replace('/uploads/', ''),
            );
            this.logger.log(`Checking file: ${filePath}`);
            try {
                await fs.access(filePath); // Проверяем, существует ли файл
                this.logger.log(`Serving file: ${filePath}`);
                // Файл будет обслуживаться @fastify/static, просто пропускаем
                next();
            } catch (err) {
                this.logger.warn(`File not found: ${filePath}`);
                next();
            }
        } else {
            next();
        }
    }
}
