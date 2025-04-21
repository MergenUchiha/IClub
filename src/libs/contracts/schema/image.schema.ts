import { z } from 'zod';
export const ImageCreateRequestSchema = z.object({
    originalName: z.string(),
    fileName: z.string(),
    filePath: z.string(),
    mimeType: z.string(),
    size: z.string(),
    shopId: z.string().optional(),
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
    shopId: z.string().optional(),
    productId: z.string().optional(),
});
export const ImagesResponseSchema = z.array(ImageResponseSchema);
