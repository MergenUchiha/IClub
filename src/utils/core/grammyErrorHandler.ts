import { Injectable, Logger } from '@nestjs/common';
import { GrammyError, HttpError } from 'grammy';

@Injectable()
export class GrammyErrorHandler {
    private readonly logger = new Logger(GrammyErrorHandler.name);

    handleError(error: unknown) {
        if (error instanceof GrammyError) {
            this.logger.error(
                `Grammy API Error: ${error.description} (code: ${error.error_code})`,
            );
        } else if (error instanceof HttpError) {
            this.logger.error(`HTTP Error: ${error.message}`);
        } else {
            this.logger.error(`Unexpected error: ${JSON.stringify(error)}`);
        }
    }
}
