export interface HttpExceptionResponse {
    statusCode: number;
    message: string | object | undefined;
}

export interface CustomHttpExceptionResponse extends HttpExceptionResponse {
    path: string;
    method: string;
    timeStamp: Date;
}
