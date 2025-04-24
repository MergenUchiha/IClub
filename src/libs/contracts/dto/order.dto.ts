import { createZodDto } from 'nestjs-zod';
import { OrderCreateRequestSchema } from '../schema';

export class CreateOrderDto extends createZodDto(OrderCreateRequestSchema) {}
