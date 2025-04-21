import { z } from 'zod';
import { ImagesResponseSchema } from './image.schema';
import { createZodDto } from 'nestjs-zod';

export const ProductCreateRequestSchema = z.object({
    name: z.string(),
    price: z.number().positive(),
    categoryId: z.string().uuid(),
});

export const ProductUpdateRequestSchema = z.object({
    name: z.string(),
    price: z.number().positive(),
});

export const ProductResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    price: z.number().positive(),
    categoryId: z.string().uuid(),
    images: ImagesResponseSchema.optional(),
});

export const ProductsResponseSchema = z.array(ProductResponseSchema);

export type TApiProductResponse = z.infer<typeof ProductResponseSchema>;
export type TApiProductsResponse = z.infer<typeof ProductsResponseSchema>;

export class ProductResponseDto extends createZodDto(ProductResponseSchema) {}
export class ProductsResponseDto extends createZodDto(ProductsResponseSchema) {}
