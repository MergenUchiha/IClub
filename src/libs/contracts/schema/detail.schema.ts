import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const TurkmenistanPhoneNumberRegex = /^\+9936[0-9]{6}$/;
export const Lesson = z.enum([
    'LESSON1PLACE1',
    'LESSON1PLACE2',
    'LESSON2PLACE1',
    'LESSON2PLACE2',
    'LESSON3PLACE1',
    'LESSON3PLACE2',
]);
export type Lesson = z.infer<typeof Lesson>;

export const DetailAddRequestSchema = z.object({
    group: z.string(),
    teacher: z.string(),
    phoneNumber: z.string().regex(TurkmenistanPhoneNumberRegex, {
        message:
            'Номер телефона должен быть в формате Туркменистана, например, +99361123456',
    }),
    lesson: Lesson,
});

export const DetailUpdateRequestSchema = z.object({
    group: z.string().optional(),
    teacher: z.string().optional(),
    phoneNumber: z
        .string()
        .regex(TurkmenistanPhoneNumberRegex, {
            message:
                'Номер телефона должен быть в формате Туркменистана, например, +99361123456',
        })
        .optional(),
});

export const DetailResponseSchema = z.object({
    id: z.string().uuid(),
    group: z.string(),
    teacher: z.string(),
    phoneNumber: z.string().regex(TurkmenistanPhoneNumberRegex, {
        message:
            'Номер телефона должен быть в формате Туркменистана, например, +99361123456',
    }),
    lesson: Lesson,
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const DetailsResponseSchema = z.array(DetailResponseSchema);
export type TApiDetailResponse = z.infer<typeof DetailResponseSchema>;
export type TApiDetailsResponse = z.infer<typeof DetailsResponseSchema>;

export class DetailResponseDto extends createZodDto(DetailResponseSchema) {}
export class DetailsResponseDto extends createZodDto(DetailsResponseSchema) {}
