import { FastifyCorsOptions } from '@fastify/cors';

/**
 * The API is called with credentials (the refresh-token cookie), so a
 * wildcard origin is not an option: browsers reject `*` together with
 * `credentials: true`, and it would let any site drive an authenticated
 * session.
 *
 * Allowed origins come from the CORS_ORIGINS environment variable as a
 * comma-separated list. In development an empty list falls back to localhost
 * on any port.
 */
export function getCorsOptions(
    origins: string,
    isProduction: boolean,
): FastifyCorsOptions {
    const allowList = origins
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);

    const localhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

    return {
        origin: (origin, callback) => {
            // Requests without an Origin header (curl, health probes,
            // same-origin navigation) are not cross-site requests.
            if (!origin) return callback(null, true);

            if (allowList.includes(origin)) return callback(null, true);
            if (!isProduction && localhost.test(origin)) {
                return callback(null, true);
            }

            // Answering with an error turns every cross-origin request into
            // a 500. Withholding the header is what CORS actually calls for:
            // the browser then refuses to hand the response to the page.
            return callback(null, false);
        },
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
        optionsSuccessStatus: 204,
        preflightContinue: false,
    };
}
