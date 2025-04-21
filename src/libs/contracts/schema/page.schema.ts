import { z } from 'zod';

export const PageSchema = z.object({
    order: z.enum(['asc', 'desc']).optional(),
    page: z.number().gte(1).default(1),
    take: z
        .enum(['5', '10', '20', '30', '50', '100'])
        .default('5')
        .transform((val) => Number(val)),
    q: z.string().nonempty(),
});
