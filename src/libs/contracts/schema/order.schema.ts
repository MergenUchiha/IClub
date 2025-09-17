import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import {
    OrderItemsCreateSchema,
    OrderItemsResponseSchema,
} from './orderItem.schema';
import { UserResponseSchema } from './user.schema';

export const OrderCreateRequestSchema = z.object({
    description: z.string().optional(),
    orderItems: OrderItemsCreateSchema.nonempty(),
});

export const OrderUpdateRequestSchema = z.object({
    description: z.string().optional(),
    status: z
        .enum(['PENDING', 'VERIFIED', 'CANCELLED', 'COMPLETED'])
        .optional(),
});

export const OrderResponseSchema = z.object({
    id: z.string().uuid(),
    orderNumber: z.number(),
    status: z.enum(['PENDING', 'VERIFIED', 'CANCELLED', 'COMPLETED']),
    description: z.string().optional(),
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
