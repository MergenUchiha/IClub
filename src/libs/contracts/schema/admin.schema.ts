import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const AdminRegistrationRequestSchema = z.object({
    username: z.string(),
    password: z.string().min(8),
});

export const AdminLoginRequestSchema = z.object({
    username: z.string(),
    password: z.string(),
});

export const AdminResponseSchema = z.object({
    id: z.string().uuid(),
    username: z.string(),
});

export const AdminTokenResponseSchema = z.object({
    id: z.string().uuid(),
    username: z.string(),
    refreshToken: z.string().jwt(),
    accessToken: z.string().jwt(),
});

export type TApiAdminResponse = z.infer<typeof AdminResponseSchema>;

export class TApiAdminAuthTokenResponse extends createZodDto(
    AdminTokenResponseSchema.pick({
        refreshToken: true,
        accessToken: true,
    }),
) {}

export class AdminResponseDto extends createZodDto(AdminResponseSchema) {}
export class AdminAuthTokenResponseDto extends createZodDto(
    AdminTokenResponseSchema,
) {}
