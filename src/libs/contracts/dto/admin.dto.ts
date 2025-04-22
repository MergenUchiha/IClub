import { createZodDto } from 'nestjs-zod';
import {
    AdminLoginRequestSchema,
    AdminRegistrationRequestSchema,
} from '../schema/admin.schema';

export class AdminRegistrationDto extends createZodDto(
    AdminRegistrationRequestSchema,
) {}

export class AdminLoginDto extends createZodDto(AdminLoginRequestSchema) {}
