import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { SentryExceptionCaptured } from '@sentry/nestjs';
import { Request, Response } from 'express';
import { LoggerService } from '../logger/logger.service';
import { CustomHttpExceptionResponse } from './httpExceptionResponse.interface';

interface CustomRequest extends Request {
    currentUser?: any;
    files?: Express.Multer.File[];
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(private logger: LoggerService) {}

    @SentryExceptionCaptured()
    async catch(exception: any, host: ArgumentsHost): Promise<void> {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<CustomRequest>();
        let status: HttpStatus;
        let errorMessage: string | undefined;

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const errorResponse = exception.getResponse() as {
                message?: string | string[];
            };

            if (
                typeof errorResponse === 'object' &&
                'message' in errorResponse
            ) {
                errorMessage = Array.isArray(errorResponse.message)
                    ? errorResponse.message.join(', ')
                    : errorResponse.message;
            } else {
                errorMessage = `${exception.message}`;
            }
        } else {
            errorMessage =
                exception instanceof Error
                    ? exception.message
                    : 'Internal server error';
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        const errorResponse = this.getErrorResponse(
            status,
            errorMessage,
            request,
        );
        const errorStack =
            exception instanceof Error ? (exception.stack ?? '') : '';

        this.logError(errorResponse, request, errorStack);

        response.status(status).send(errorResponse);
    }

    private getErrorResponse = (
        status: HttpStatus,
        errorMessage: string | undefined,
        request: Request,
    ): CustomHttpExceptionResponse => ({
        statusCode: status,
        message: errorMessage,
        path: request.url,
        method: request.method,
        timeStamp: new Date(),
    });

    private logError = (
        errorResponse: CustomHttpExceptionResponse,
        request: CustomRequest,
        errorStack: string,
    ) => {
        const { statusCode, message } = errorResponse;
        const { method, originalUrl } = request;

        let host: string | undefined;
        const realIpHeader = request.headers['x-real-ip'];

        if (Array.isArray(realIpHeader)) {
            host = realIpHeader[0];
        } else {
            host = realIpHeader ?? 'localhost';
        }

        const logDetails = {
            host,
            statusCode,
            method,
            url: originalUrl,
            user: JSON.stringify(
                request.currentUser ?? 'Not signed in',
                null,
                2,
            ),
            errorStack,
        };

        this.logger.error(
            `Ошибка: ${message} | Статус: ${statusCode} | Метод: ${method} | URL: ${originalUrl}`,
            JSON.stringify(logDetails),
        );
    };
}
