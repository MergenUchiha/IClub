import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { UserResponseSchema } from './user.schema';

export const Lesson = z.enum(['LESSON1', 'LESSON2', 'LESSON3']);
export type Lesson = z.infer<typeof Lesson>;

export const DetailAddRequestSchema = z.object({
    tv: z.boolean(),
    lesson: Lesson,
});

export const DetailUpdateRequestSchema = z.object({
    tv: z.boolean().optional(),
    lesson: Lesson.optional(),
});

export const DetailResponseSchema = z.object({
    id: z.string().uuid(),
    lesson: Lesson,
    tv: z.boolean(),
    user: UserResponseSchema,
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const DetailsResponseSchema = z.array(DetailResponseSchema);
export type TApiDetailResponse = z.infer<typeof DetailResponseSchema>;
export type TApiDetailsResponse = z.infer<typeof DetailsResponseSchema>;

export class DetailResponseDto extends createZodDto(DetailResponseSchema) {}
export class DetailsResponseDto extends createZodDto(DetailsResponseSchema) {}
