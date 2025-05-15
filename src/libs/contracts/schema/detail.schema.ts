import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const TurkmenistanPhoneNumberRegex = /^\+9936[0-9]{6}$/;
export const Lesson = z.enum(['LESSON1', 'LESSON2', 'LESSON3']);
export type Lesson = z.infer<typeof Lesson>;

export const DetailAddRequestSchema = z.object({
    group: z.string(),
    lesson: z.string(),
    tv: z.boolean(),
    department: z.string(),
    teacher: z.string(),
    phoneNumber: z.string().regex(TurkmenistanPhoneNumberRegex, {
        message:
            'Номер телефона должен быть в формате Туркменистана, например, +99361123456',
    }),
    lessonNumber: Lesson,
});

export const DetailUpdateRequestSchema = z.object({
    group: z.string().optional(),
    lesson: z.string().optional(),
    tv: z.boolean().optional(),
    department: z.string().optional(),
    teacher: z.string().optional(),
    phoneNumber: z
        .string()
        .regex(TurkmenistanPhoneNumberRegex, {
            message:
                'Номер телефона должен быть в формате Туркменистана, например, +99361123456',
        })
        .optional(),
    lessonNumber: Lesson.optional(),
});

export const DetailResponseSchema = z.object({
    id: z.string().uuid(),
    group: z.string(),
    teacher: z.string(),
    phoneNumber: z.string().regex(TurkmenistanPhoneNumberRegex, {
        message:
            'Номер телефона должен быть в формате Туркменистана, например, +99361123456',
    }),
    lessonNumber: Lesson,
    lesson: z.string(),
    tv: z.boolean(),
    department: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const DetailsResponseSchema = z.array(DetailResponseSchema);
export type TApiDetailResponse = z.infer<typeof DetailResponseSchema>;
export type TApiDetailsResponse = z.infer<typeof DetailsResponseSchema>;

export class DetailResponseDto extends createZodDto(DetailResponseSchema) {}
export class DetailsResponseDto extends createZodDto(DetailsResponseSchema) {}
