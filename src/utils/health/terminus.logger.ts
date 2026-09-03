import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';

/**
 * Terminus logs the full error of every failed probe. A failing health check
 * already surfaces in the response, so the noisy stack traces are dropped.
 */
@Injectable({ scope: Scope.TRANSIENT })
export class TerminusLogger extends ConsoleLogger {
    error(message: unknown, ...optionalParams: unknown[]): void {
        super.warn(`Health check failed: ${String(message)}`);
        void optionalParams;
    }
}
