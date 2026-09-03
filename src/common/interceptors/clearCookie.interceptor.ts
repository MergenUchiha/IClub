import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/** Drops the refresh-token cookie once the token has been revoked. */
@Injectable()
export class ClearCookieInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const reply = context.switchToHttp().getResponse<FastifyReply>();

        return next.handle().pipe(
            tap(() => {
                reply.clearCookie('refreshToken', { path: '/' });
            }),
        );
    }
}
