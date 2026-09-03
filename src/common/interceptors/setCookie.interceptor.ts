import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FastifyReply } from 'fastify';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// Fastify counts Max-Age in seconds; Express counted milliseconds.
const THIRTY_DAYS_IN_SECONDS = 30 * 24 * 60 * 60;

/**
 * Stores the refresh token in an httpOnly cookie, which is where
 * `GET /auth/*_/refresh` reads it from.
 *
 * The token is still returned in the response body as well, because existing
 * clients read it from there. Dropping it from the body would be the stricter
 * choice and is worth doing once the clients are updated.
 */
@Injectable()
export class SetCookieInterceptor implements NestInterceptor {
    constructor(private readonly configService: ConfigService) {}

    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<unknown> {
        const reply = context.switchToHttp().getResponse<FastifyReply>();
        const isProduction =
            this.configService.get<string>('NODE_ENV') === 'production';

        return next.handle().pipe(
            tap((data: { response?: { refreshToken?: string } }) => {
                const refreshToken = data?.response?.refreshToken;
                if (!refreshToken) return;

                reply.setCookie('refreshToken', refreshToken, {
                    maxAge: THIRTY_DAYS_IN_SECONDS,
                    httpOnly: true,
                    path: '/',
                    sameSite: 'strict',
                    // Over plain http (local development) a secure cookie is
                    // silently dropped by the browser.
                    secure: isProduction,
                });
            }),
        );
    }
}
