import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const TurkmenistanPhoneNumberRegex = /^\+9936[0-9]{7}$/;

export const UserCreateRequestSchema = z.object({
    firstName: z.string(),
    secondName: z.string(),
    studentId: z.string().optional(),
    department: z.string(),
    phoneNumber: z.string().regex(TurkmenistanPhoneNumberRegex, {
        message:
            'Номер телефона должен быть в формате Туркменистана, например, +99361123456',
    }),
    isTeacher: z.boolean().optional(),
    password: z.string().min(8),
});

export const UserUpdateRequestSchema = z.object({
    firstName: z.string().optional(),
    secondName: z.string().optional(),
    department: z.string().optional(),
    isTeacher: z.boolean().optional(),
    studentId: z.string().optional(),
    phoneNumber: z
        .string()
        .regex(TurkmenistanPhoneNumberRegex, {
            message:
                'Номер телефона должен быть в формате Туркменистана, например, +99361123456',
        })
        .optional(),
    password: z.string().min(8).optional(),
});

export const UserLoginRequestSchema = z.object({
    phoneNumber: z.string().regex(TurkmenistanPhoneNumberRegex, {
        message:
            'Номер телефона должен быть в формате Туркменистана, например, +99361123456',
    }),
    password: z.string().min(8),
});

export const UserResponseSchema = z.object({
    id: z.string().uuid(),
    firstName: z.string(),
    secondName: z.string(),
    studentId: z.string(),
    department: z.string(),
    isTeacher: z.boolean(),
    phoneNumber: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const UserTokenResponseSchema = z.object({
    id: z.string().uuid(),
    firstName: z.string(),
    secondName: z.string(),
    studentId: z.string(),
    department: z.string(),
    isTeacher: z.boolean(),
    phoneNumber: z.string(),
    refreshToken: z.string().jwt(),
    accessToken: z.string().jwt(),
});

export const UsersResponseSchema = z.array(UserResponseSchema);

export type TApiUserResponse = z.infer<typeof UserResponseSchema>;
export type TApiUsersResponse = z.infer<typeof UsersResponseSchema>;

export class TApiUserAuthTokenResponse extends createZodDto(
    UserTokenResponseSchema.pick({
        id: true,
        firstName: true,
        secondName: true,
        phoneNumber: true,
        isTeacher: true,
        refreshToken: true,
        accessToken: true,
    }),
) {}

export class UserResponseDto extends createZodDto(UserResponseSchema) {}
export class UsersResponseDto extends createZodDto(UsersResponseSchema) {}

export class UserAuthTokenResponseDto extends createZodDto(
    UserTokenResponseSchema,
) {}
