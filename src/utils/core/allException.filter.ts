import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SentryExceptionCaptured } from '@sentry/nestjs';
import { FastifyReply, FastifyRequest } from 'fastify';
import { LoggerService } from '../logger/logger.service';
import { CustomHttpExceptionResponse } from './httpExceptionResponse.interface';

interface RequestWithUser extends FastifyRequest {
    currentUser?: { id: string };
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(
        private logger: LoggerService,
        private configService: ConfigService,
    ) {}

    @SentryExceptionCaptured()
    async catch(exception: unknown, host: ArgumentsHost): Promise<void> {
        const ctx = host.switchToHttp();
        const reply = ctx.getResponse<FastifyReply>();
        const request = ctx.getRequest<RequestWithUser>();

        let status: HttpStatus;
        let errorMessage: string;

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const response = exception.getResponse() as
                string | { message?: string | string[] };

            if (typeof response === 'string') {
                errorMessage = response;
            } else if (Array.isArray(response.message)) {
                errorMessage = response.message.join(', ');
            } else {
                errorMessage = response.message ?? exception.message;
            }
        } else {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            // An unhandled error can carry query fragments or connection
            // details in its message, so clients only ever see a generic one.
            errorMessage =
                this.configService.get<string>('NODE_ENV') === 'production'
                    ? 'Internal server error'
                    : exception instanceof Error
                      ? exception.message
                      : 'Internal server error';
        }

        const errorResponse = this.getErrorResponse(
            status,
            errorMessage,
            request,
        );
        const errorStack =
            exception instanceof Error ? (exception.stack ?? '') : '';

        this.logError(errorResponse, request, errorStack);

        await reply.status(status).send(errorResponse);
    }

    private getErrorResponse = (
        status: HttpStatus,
        errorMessage: string,
        request: FastifyRequest,
    ): CustomHttpExceptionResponse => ({
        statusCode: status,
        message: errorMessage,
        path: request.url,
        method: request.method,
        timeStamp: new Date(),
    });

    private logError = (
        errorResponse: CustomHttpExceptionResponse,
        request: RequestWithUser,
        errorStack: string,
    ) => {
        const { statusCode, message } = errorResponse;
        const realIpHeader = request.headers['x-real-ip'];
        const host = Array.isArray(realIpHeader)
            ? realIpHeader[0]
            : (realIpHeader ?? request.ip);

        this.logger.error(
            `${request.method} ${request.url} -> ${statusCode}: ${message}`,
            errorStack,
            JSON.stringify({ host, user: request.currentUser?.id ?? null }),
        );
    };
}
