import { createZodDto } from 'nestjs-zod';
import { PageSchema } from '../schema/page.schema';

export class PageDto extends createZodDto(PageSchema) {}
