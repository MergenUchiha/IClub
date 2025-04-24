import { createZodDto } from 'nestjs-zod';
import { BookingCreateRequestSchema } from '../schema';

export class CreateBookingDto extends createZodDto(
    BookingCreateRequestSchema,
) {}
