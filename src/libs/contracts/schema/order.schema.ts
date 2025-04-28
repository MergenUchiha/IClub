import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import {
    OrderItemsCreateSchema,
    OrderItemsResponseSchema,
} from './orderItem.schema';
import { UserResponseSchema } from './user.schema';

enum Status {
    PENDING = 'PENDING',
    VERIFIED = 'VERIFIED',
    CANCELLED = 'CANCELLED',
}

export const OrderCreateRequestSchema = z.object({
    orderItems: OrderItemsCreateSchema.nonempty(),
});

export const OrderUpdateRequestSchema = z.object({
    status: z.enum([Status.PENDING, Status.VERIFIED]).optional(),
});

export const OrderResponseSchema = z.object({
    id: z.string().uuid(),
    status: z.enum([Status.PENDING, Status.VERIFIED, Status.CANCELLED]),
    totalPrice: z.number().positive(),
    user: UserResponseSchema,
    orderItems: OrderItemsResponseSchema.nonempty(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const OrdersResponseSchema = z.array(OrderResponseSchema);
export type TApiOrderResponse = z.infer<typeof OrderResponseSchema>;
export type TApiOrdersResponse = z.infer<typeof OrdersResponseSchema>;

export class OrderResponseDto extends createZodDto(OrderResponseSchema) {}
export class OrdersResponseDto extends createZodDto(OrdersResponseSchema) {}
