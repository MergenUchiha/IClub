import { z } from 'zod';
import { ImageResponseSchema } from './image.schema';
import { createZodDto } from 'nestjs-zod';

export const ProductCreateRequestSchema = z.object({
    name: z.string().min(1).max(25),
    description: z.string().min(1),
    // The column is an integer, so a fractional price would only fail once it
    // reached the database.
    price: z.number().int().positive(),
    categoryId: z.string().uuid(),
});

export const ProductUpdateRequestSchema = z.object({
    name: z.string().min(1).max(25).optional(),
    description: z.string().min(1).optional(),
    price: z.number().int().positive().optional(),
    categoryId: z.string().uuid().optional(),
});

export const ProductResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    description: z.string(),
    price: z.number().int().positive(),
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
