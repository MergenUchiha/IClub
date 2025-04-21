import { z } from 'zod';
import { ShopResponseSchema } from './shop.schema';

export const RegionCreateRequestSchema = z.object({
    name: z.string(),
});

export const RegionUpdateRequestSchema = z.object({
    name: z.string(),
});

export const RegionResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    shops: ShopResponseSchema.optional(),
});

export const RegionsResponseSchema = z.array(RegionResponseSchema);

export type TApiRegionResponse = z.infer<typeof RegionResponseSchema>;
export type TApiRegionsResponse = z.infer<typeof RegionsResponseSchema>;
