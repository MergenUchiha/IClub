import { createZodDto } from 'nestjs-zod';
import { DepartmentRequestSchema } from '../schema/department.schema';

export class CreateDepartmentDto extends createZodDto(
    DepartmentRequestSchema,
) {}
