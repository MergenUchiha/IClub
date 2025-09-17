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
    userId: z.string().uuid(),
    bookingId: z.string().uuid(),
    user: UserResponseSchema,
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const DetailsResponseSchema = z.array(DetailResponseSchema);
export type TApiDetailResponse = z.infer<typeof DetailResponseSchema>;
export type TApiDetailsResponse = z.infer<typeof DetailsResponseSchema>;

export class DetailResponseDto extends createZodDto(DetailResponseSchema) {}
export class DetailsResponseDto extends createZodDto(DetailsResponseSchema) {}

//Get my details \\
export const GetMyDetailBookingResponseSchema = z.object({
    bookingDate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});

export const MyDetailResponseSchema = z.object({
    id: z.string().uuid(),
    lesson: Lesson,
    tv: z.boolean(),
    userId: z.string().uuid(),
    bookingId: z.string().uuid(),
    booking: GetMyDetailBookingResponseSchema,
    user: UserResponseSchema,
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const MyDetailsResponseSchema = z.array(MyDetailResponseSchema);
export type TApiMyDetailResponse = z.infer<typeof MyDetailResponseSchema>;
export type TApiMyDetailsResponse = z.infer<typeof MyDetailsResponseSchema>;
