import { createZodDto } from 'nestjs-zod';
import { OrderCreateRequestSchema, OrderUpdateRequestSchema } from '../schema';

export class CreateOrderDto extends createZodDto(OrderCreateRequestSchema) {}
export class UpdateOrderDto extends createZodDto(OrderUpdateRequestSchema) {}
