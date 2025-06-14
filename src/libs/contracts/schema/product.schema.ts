import { z } from 'zod';
import { ImageResponseSchema } from './image.schema';
import { createZodDto } from 'nestjs-zod';

export const ProductCreateRequestSchema = z.object({
    name: z.string(),
    description: z.string(),
    price: z.number().positive(),
    categoryId: z.string().uuid(),
});

export const ProductUpdateRequestSchema = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    price: z.number().positive().optional(),
    categoryId: z.string().uuid().optional(),
});

export const ProductResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    description: z.string(),
    price: z.number().positive(),
    categoryId: z.string().uuid(),
    image: ImageResponseSchema.nullable().optional(),
});

export const ProductForOrderResponse = z.object({
    name: z.string(),
});

export const ProductsResponseSchema = z.array(ProductResponseSchema);

export type TApiProductResponse = z.infer<typeof ProductResponseSchema>;
export type TApiProductsResponse = z.infer<typeof ProductsResponseSchema>;

export class ProductResponseDto extends createZodDto(ProductResponseSchema) {}
export class ProductsResponseDto extends createZodDto(ProductsResponseSchema) {}
