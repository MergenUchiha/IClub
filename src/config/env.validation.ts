import * as z from 'zod';

/**
 * Parses the string values that come from a `.env` file into booleans.
 * `z.coerce.boolean()` cannot be used here: it follows JavaScript truthiness,
 * so the string 'false' would become `true`.
 */
const booleanFromString = z
    .enum(['true', 'false'])
    .transform((value) => value === 'true');

const portFromString = z.coerce.number().int().positive();

export const envSchema = z
    .object({
        NODE_ENV: z
            .enum(['development', 'test', 'production'])
            .default('development'),
        PORT: portFromString,
        BACKEND_URL: z.string().url(),

        COOKIE_SECRET: z.string().min(16),

        DATABASE_URL: z.string().url(),

        IS_SWAGGER_ENABLED: booleanFromString.default('false'),

        JWT_ACCESS_SECRET: z.string().min(16),
        JWT_REFRESH_SECRET: z.string().min(16),
        JWT_ACCESS_TIME: z.string(),
        JWT_REFRESH_TIME: z.string(),

        JWT_ADMIN_ACCESS_SECRET: z.string().min(16),
        JWT_ADMIN_REFRESH_SECRET: z.string().min(16),
        JWT_ADMIN_ACCESS_TIME: z.string(),
        JWT_ADMIN_REFRESH_TIME: z.string(),

        DEFAULT_ADMIN_USERNAME: z.string().min(1),
        DEFAULT_ADMIN_PASSWORD: z.string().min(8),

        HEALTH_CHECK_TOKEN: z.string().min(16),

        // Comma-separated list of origins allowed to call the API
        // with credentials.
        CORS_ORIGINS: z.string().default(''),

        // Rate limiting is backed by Redis and is only enabled in production.
        REDIS_HOST: z.string().optional(),
        REDIS_PORT: portFromString.optional(),
        REDIS_PASSWORD: z.string().optional(),
        RATE_LIMIT_TTL: z.coerce.number().int().positive().default(60000),
        RATE_LIMIT_LIMIT: z.coerce.number().int().positive().default(100),

        // An empty value disables Sentry. .optional() alone is not enough:
        // the key is present in .env, it just holds an empty string.
        SENTRY_DSN: z
            .union([z.literal(''), z.string().url()])
            .optional()
            .transform((value) => value || undefined),
    })
    .superRefine((config, ctx) => {
        if (config.NODE_ENV !== 'production') return;

        // Redis only becomes mandatory in production, where it stores the
        // rate-limiting counters shared between instances.
        for (const key of ['REDIS_HOST', 'REDIS_PORT', 'REDIS_PASSWORD']) {
            if (!config[key as 'REDIS_HOST']) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: [key],
                    message: 'Required when NODE_ENV=production',
                });
            }
        }

        if (config.CORS_ORIGINS.trim() === '') {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['CORS_ORIGINS'],
                message: 'Required when NODE_ENV=production',
            });
        }
    });

export type EnvConfig = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): EnvConfig {
    const parsed = envSchema.safeParse(config);
    if (parsed.success) return parsed.data;

    const formattedErrors = parsed.error.errors
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join(', ');
    throw new Error(`Config validation error: ${formattedErrors}`);
}
