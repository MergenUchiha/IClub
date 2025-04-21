import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const TurkmenistanPhoneNumberRegex = /^\+9936[0-9]{6}$/;

export const UserRegistrationRequestSchema = z.object({
    firstName: z.string(),
    secondName: z.string(),
    phoneNumber: z.string().regex(TurkmenistanPhoneNumberRegex, {
        message:
            'Номер телефона должен быть в формате Туркменистана, например, +99361123456',
    }),
    password: z.string().min(8),
});

export const UserVerificationRequestSchema = z.object({
    code: z.string().min(6),
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
    phoneNumber: z.string(),
});

export const UserTokenResponseSchema = z.object({
    id: z.string().uuid(),
    firstName: z.string(),
    secondName: z.string(),
    phoneNumber: z.string(),
    refreshToken: z.string().jwt(),
    accessToken: z.string().jwt(),
});

export type TApiUserResponse = z.infer<typeof UserResponseSchema>;

export class TApiUserAuthTokenResponse extends createZodDto(
    UserTokenResponseSchema.pick({
        id: true,
        firstName: true,
        secondName: true,
        phoneNumber: true,
        refreshToken: true,
        accessToken: true,
    }),
) {}

export class UserResponseDto extends createZodDto(UserResponseSchema) {}
export class UserAuthTokenResponseDto extends createZodDto(
    UserTokenResponseSchema,
) {}
