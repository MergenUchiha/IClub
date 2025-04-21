import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerService } from 'src/utils/logger/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(private readonly logger: LoggerService) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { method, originalUrl } = request;
        const startTime = Date.now();

        this.logger.log(
            `Incoming Request: ${method} ${originalUrl}`,
            'LoggingInterceptor',
        );

        return next.handle().pipe(
            tap(() => {
                const elapsedTime = Date.now() - startTime;
                this.logger.log(
                    `Response: ${method} ${originalUrl} | Duration: ${elapsedTime}ms`,
                    'LoggingInterceptor',
                );
            }),
        );
    }
}
