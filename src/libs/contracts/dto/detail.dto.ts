import { createZodDto } from 'nestjs-zod';
import { DetailAddRequestSchema, DetailUpdateRequestSchema } from '../schema';

export class AddBookingDetailDto extends createZodDto(DetailAddRequestSchema) {}

export class UpdateBookingDetailDto extends createZodDto(
    DetailUpdateRequestSchema,
) {}
