import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerService } from 'src/utils/logger/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(private readonly logger: LoggerService) {}

    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<unknown> {
        const request = context.switchToHttp().getRequest<FastifyRequest>();
        // Fastify exposes `url`; `originalUrl` is an Express field and was
        // logged as undefined on every single request.
        const { method, url } = request;
        const startTime = Date.now();

        this.logger.log(
            `Incoming request: ${method} ${url}`,
            'LoggingInterceptor',
        );

        return next.handle().pipe(
            tap(() => {
                const elapsedTime = Date.now() - startTime;
                this.logger.log(
                    `Response: ${method} ${url} | Duration: ${elapsedTime}ms`,
                    'LoggingInterceptor',
                );
            }),
        );
    }
}
