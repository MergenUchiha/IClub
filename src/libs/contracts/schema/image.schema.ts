import { z } from 'zod';
export const ImageCreateRequestSchema = z.object({
    originalName: z.string(),
    fileName: z.string(),
    filePath: z.string(),
    mimeType: z.string(),
    size: z.string(),
    productId: z.string().optional(),
});

export const ImageResponseSchema = z.object({
    id: z.string(),
    originalName: z.string(),
    fileName: z.string(),
    filePath: z.string(),
    mimeType: z.string(),
    size: z.string(),
    createdAt: z.date(),
    // Nullable in the database: an image can exist without a product.
    productId: z.string().nullable(),
});
export const ImagesResponseSchema = z.array(ImageResponseSchema);

export type TApiImageResponse = z.infer<typeof ImageResponseSchema>;
