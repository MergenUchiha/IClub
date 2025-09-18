import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { DetailAddRequestSchema, DetailsResponseSchema } from './detail.schema';

export const GetBookingByDateRequestSchema = z.object({
    bookingDate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});

export const BookingCreateRequestSchema = z.object({
    bookingDate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    details: DetailAddRequestSchema,
});

export const BookingUpdateRequestSchema = z.object({
    bookingDate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    details: DetailAddRequestSchema.optional(),
});

export const BookingResponseSchema = z.object({
    id: z.string().uuid(),
    bookingDate: z.string(),
    details: DetailsResponseSchema.optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const BookingsResponseSchema = z.array(BookingResponseSchema);
export type TApiBookingResponse = z.infer<typeof BookingResponseSchema>;
export type TApiBookingsResponse = z.infer<typeof BookingsResponseSchema>;

export class BookingResponseDto extends createZodDto(BookingResponseSchema) {}
export class BookingsResponseDto extends createZodDto(BookingsResponseSchema) {}
