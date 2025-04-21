import { createZodDto } from 'nestjs-zod';
import {
    CategoryCreateRequestSchema,
    CategoryUpdateRequestSchema,
} from '../schema';

export class CreateCategoryDto extends createZodDto(
    CategoryCreateRequestSchema,
) {}

export class UpdateCategoryDto extends createZodDto(
    CategoryUpdateRequestSchema,
) {}
