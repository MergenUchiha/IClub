import * as Sentry from '@sentry/nestjs';
import * as dotenv from 'dotenv';

// Loaded before the Nest application so that Sentry can instrument the
// libraries it patches. ConfigService is not available this early, hence
// reading the .env file directly.
dotenv.config();

const dsn = process.env.SENTRY_DSN;

if (dsn) {
    Sentry.init({
        dsn,
        environment: process.env.NODE_ENV ?? 'development',
        tracesSampleRate: 0.1,
    });
}
