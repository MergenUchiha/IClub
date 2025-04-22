import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SetCookieInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();

        return next.handle().pipe(
            map((data) => {
                if (data && data.response.refreshToken) {
                    console.log(data.response);
                    response.cookie(
                        'refreshToken',
                        data.response.refreshToken,
                        {
                            maxAge: 30 * 24 * 60 * 60 * 1000,
                            httpOnly: true,
                            path: '/',
                            sameSite: 'Lax',
                            secure: true,
                        },
                    );

                    const { refreshToken, ...responseBody } = data;
                    return responseBody;
                }
                return data;
            }),
        );
    }
}
