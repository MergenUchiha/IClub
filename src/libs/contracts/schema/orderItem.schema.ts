import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ProductForOrderResponse } from './product.schema';

export const OrderItemCreateRequestSchema = z.object({
    productId: z.string().uuid(),
    quantity: z.number().positive(),
    price: z.number().positive(),
});

export const OrderItemUpdateRequestSchema = z.object({
    quantity: z.number().positive().optional(),
});

export const OrderItemResponseSchema = z.object({
    id: z.string().uuid(),
    productId: z.string().uuid(),
    quantity: z.number().positive(),
    price: z.number().positive(),
    product: ProductForOrderResponse.optional(),
    orderId: z.string().uuid(),
});

export const OrderItemsCreateSchema = z.array(OrderItemCreateRequestSchema);
export const OrderItemsResponseSchema = z.array(OrderItemResponseSchema);
export type TApiOrderItemResponse = z.infer<typeof OrderItemResponseSchema>;
export type TApiOrderItemsResponse = z.infer<typeof OrderItemsResponseSchema>;

export class OrderItemResponseDto extends createZodDto(
    OrderItemResponseSchema,
) {}
export class OrderItemsResponseDto extends createZodDto(
    OrderItemsResponseSchema,
) {}
