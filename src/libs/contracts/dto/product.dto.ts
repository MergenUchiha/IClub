import { createZodDto } from 'nestjs-zod';
import {
    ProductCreateRequestSchema,
    ProductUpdateRequestSchema,
} from '../schema/product.schema';

export class CreateProductDto extends createZodDto(
    ProductCreateRequestSchema,
) {}

export class UpdateProductDto extends createZodDto(
    ProductUpdateRequestSchema,
) {}
