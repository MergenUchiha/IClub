import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const TurkmenistanPhoneNumberRegex = /^\+9936[0-9]{7}$/;

export const UserCreateRequestSchema = z.object({
    firstName: z.string().min(1).max(30),
    secondName: z.string().min(1).max(30),
    studentId: z.string().max(6).optional(),
    department: z.string().min(1).max(255),
    phoneNumber: z.string().regex(TurkmenistanPhoneNumberRegex, {
        message:
            'Phone number must be a Turkmenistan number, for example +99361123456',
    }),
    isTeacher: z.boolean().optional(),
    password: z.string().min(8),
});

export const UserUpdateRequestSchema = z.object({
    firstName: z.string().min(1).max(30).optional(),
    secondName: z.string().min(1).max(30).optional(),
    department: z.string().min(1).max(255).optional(),
    isTeacher: z.boolean().optional(),
    studentId: z.string().max(6).optional(),
    phoneNumber: z
        .string()
        .regex(TurkmenistanPhoneNumberRegex, {
            message:
                'Phone number must be a Turkmenistan number, for example +99361123456',
        })
        .optional(),
    password: z.string().min(8).optional(),
});

export const UserLoginRequestSchema = z.object({
    phoneNumber: z.string().regex(TurkmenistanPhoneNumberRegex, {
        message:
            'Phone number must be a Turkmenistan number, for example +99361123456',
    }),
    password: z.string().min(8),
});

export const UserResponseSchema = z.object({
    id: z.string().uuid(),
    firstName: z.string(),
    secondName: z.string(),
    // Teachers have no student id, and the column is nullable. Requiring a
    // string here made every response containing a teacher fail to serialise.
    studentId: z.string().nullable(),
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
    studentId: z.string().nullable(),
    department: z.string(),
    isTeacher: z.boolean(),
    phoneNumber: z.string(),
    refreshToken: z.string().jwt(),
    accessToken: z.string().jwt(),
});

/**
 * What other people are allowed to see about a user. Bookings are visible to
 * every signed-in member so that taken slots are visible, but the phone
 * number and the student id are not part of that.
 */
export const PublicUserSchema = UserResponseSchema.pick({
    id: true,
    firstName: true,
    secondName: true,
    isTeacher: true,
    department: true,
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
