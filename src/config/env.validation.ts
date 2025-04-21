import * as z from 'zod';

export const envSchema = z.object({
    ENVIRONMENT: z.string(),
    PORT: z.string(),
    BACKEND_URL: z.string(),
    COOKIE_SECRET: z.string(),
    DOMAIN_NAME: z.string().optional(),

    DATABASE_URL: z.string(),

    IS_SWAGGER_ENABLED: z.coerce.boolean(),

    REDIS_HOST: z.string(),
    REDIS_PORT: z.string(),
    REDIS_PASSWORD: z.string(),

    MINIO_ENDPOINT: z.string(),
    MINIO_HOST: z.string(),
    MINIO_PORT: z.string(),
    MINIO_USE_SSL: z.string(),
    MINIO_ROOT_USER: z.string(),
    MINIO_ROOT_PASSWORD: z.string(),
    MINIO_BUCKET_NAME: z.string(),

    JWT_ACCESS_SECRET: z.string(),
    JWT_REFRESH_SECRET: z.string(),
    JWT_ACCESS_TIME: z.string(),
    JWT_REFRESH_TIME: z.string(),

    SENTRY_DNS: z.string().optional(),
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
