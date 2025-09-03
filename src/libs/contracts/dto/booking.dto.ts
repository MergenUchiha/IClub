import { createZodDto } from 'nestjs-zod';
import {
    BookingCreateRequestSchema,
    GetBookingByDateRequestSchema,
} from '../schema';

export class CreateBookingDto extends createZodDto(
    BookingCreateRequestSchema,
) {}

export class GetBookingByDateDto extends createZodDto(
    GetBookingByDateRequestSchema,
) {}
