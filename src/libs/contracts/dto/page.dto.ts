import { createZodDto } from 'nestjs-zod';
import { PageSchema } from '../schema/page.schema.js';

export class PageDto extends createZodDto(PageSchema) {}
