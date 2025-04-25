import { z } from 'zod';

export const PageSchema = z.object({
    order: z.enum(['asc', 'desc']).optional(),
    page: z.coerce.number().gte(1).default(1).optional(),
    take: z.coerce
        .string()
        .pipe(z.enum(['5', '10', '20', '30', '50', '100']))
        .default('5')
        .transform((val) => Number(val))
        .optional(),
    q: z.string().optional(),
});
