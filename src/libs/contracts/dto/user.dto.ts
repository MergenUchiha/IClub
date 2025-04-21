import { createZodDto } from 'nestjs-zod';
import {
    UserLoginRequestSchema,
    UserRegistrationRequestSchema,
    UserVerificationRequestSchema,
} from '../schema/user.schema';

export class UserRegistrationDto extends createZodDto(
    UserRegistrationRequestSchema,
) {}

export class UserLoginDto extends createZodDto(UserLoginRequestSchema) {}
export class UserVerificationDto extends createZodDto(
    UserVerificationRequestSchema,
) {}
