import { FastifyCorsOptions } from '@fastify/cors';
import { allowedOriginsStage, allowerdOriginsProd } from './allowedOrigins';

export function getCorsOptions(): FastifyCorsOptions {
    return {
        origin: async (origin: string | undefined): Promise<boolean> => {
            if (process.env.NODE_ENV === 'production') {
                if (
                    !origin ||
                    allowerdOriginsProd.some((allowedOrigin) =>
                        origin.startsWith(allowedOrigin),
                    )
                ) {
                    return true;
                }
                throw new Error('Not allowed by CORS');
            } else {
                if (
                    !origin ||
                    allowedOriginsStage.some((allowedOrigin) =>
                        origin.startsWith(allowedOrigin),
                    )
                ) {
                    return true;
                }
                throw new Error('Not allowed by CORS');
            }
        },
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
        optionsSuccessStatus: 204,
        preflightContinue: false,
    };
}
