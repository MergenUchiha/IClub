import { createZodDto } from 'nestjs-zod';
import { ShopCreateRequestSchema, ShopUpdateRequestSchema } from '../schema';

export class CreateShopDto extends createZodDto(ShopCreateRequestSchema) {}

export class UpdateShopDto extends createZodDto(ShopUpdateRequestSchema) {}
