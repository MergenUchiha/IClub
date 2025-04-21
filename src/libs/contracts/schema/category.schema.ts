import { z } from 'zod';
import { ProductsResponseSchema } from './product.schema';
import { createZodDto } from 'nestjs-zod';

export const CategoryCreateRequestSchema = z.object({
    title: z.string(),
});

export const CategoryUpdateRequestSchema = z.object({
    title: z.string(),
});

export const CategoryResponseSchema = z.object({
    id: z.string().uuid(),
    title: z.string(),
    products: ProductsResponseSchema.optional(),
});

export const CategoriesResponseSchema = z.array(CategoryResponseSchema);
export type TApiCategoryResponse = z.infer<typeof CategoryResponseSchema>;
export type TApiCategoriesResponse = z.infer<typeof CategoriesResponseSchema>;

export class CategoryResponseDto extends createZodDto(CategoryResponseSchema) {}
export class CategoriesResponseDto extends createZodDto(
    CategoriesResponseSchema,
) {}
