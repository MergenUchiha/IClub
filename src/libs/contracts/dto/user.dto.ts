import { createZodDto } from 'nestjs-zod';
import {
    UserLoginRequestSchema,
    UserCreateRequestSchema,
    UserUpdateRequestSchema,
} from '../schema/user.schema';

export class UserCreateDto extends createZodDto(UserCreateRequestSchema) {}

export class UserLoginDto extends createZodDto(UserLoginRequestSchema) {}
export class UserUpdateDto extends createZodDto(UserUpdateRequestSchema) {}
