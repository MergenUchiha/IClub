import { createZodDto } from 'nestjs-zod';
import {
    OrderItemCreateRequestSchema,
    OrderItemUpdateRequestSchema,
} from '../schema';

export class CreateOrderItemDto extends createZodDto(
    OrderItemCreateRequestSchema,
) {}

export class UpdateOrderItemDto extends createZodDto(
    OrderItemUpdateRequestSchema,
) {}
