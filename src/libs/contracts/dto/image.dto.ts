import { createZodDto } from 'nestjs-zod';
import { ImageCreateRequestSchema } from '../schema';

export class CreateImageDto extends createZodDto(ImageCreateRequestSchema) {}
