import { z } from 'zod';
import { ProductsResponseSchema } from './product.schema';
import { ImagesResponseSchema } from './image.schema';
import { createZodDto } from 'nestjs-zod';

export const ShopCreateRequestSchema = z.object({
    name: z.string(),
    contacts: z.array(
        z.object({
            phoneNumber: z.string(),
        }),
    ),
    regionId: z.string().uuid(),
});

export const ShopUpdateRequestSchema = z.object({
    name: z.string(),
    contacts: z.array(
        z.object({
            phoneNumber: z.string(),
        }),
    ),
});

export const ShopResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    contacts: z
        .array(
            z.object({
                phoneNumber: z.string().url(),
            }),
        )
        .nullable()
        .optional(),
    regionId: z.string().uuid(),
    products: ProductsResponseSchema.optional(),
    images: ImagesResponseSchema.optional(),
});

export const ShopsResponseSchema = z.array(ShopResponseSchema);
export type TApiShopResponse = z.infer<typeof ShopResponseSchema>;
export type TApiShopsResponse = z.infer<typeof ShopsResponseSchema>;

export class ShopResponseDto extends createZodDto(ShopResponseSchema) {}
export class ShopsResponseDto extends createZodDto(ShopsResponseSchema) {}
