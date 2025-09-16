import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const DepartmentRequestSchema = z.object({
    title: z.string(),
});

export const DepartmentResponseSchema = z.object({
    id: z.string().uuid(),
    title: z.string(),
});

export const DepartmentsResponseSchema = z.array(DepartmentResponseSchema);
export type TApiDepartmentResponse = z.infer<typeof DepartmentResponseSchema>;
export type TApiDepartmentsResponse = z.infer<typeof DepartmentsResponseSchema>;

export class DepartmentResponseDto extends createZodDto(
    DepartmentResponseSchema,
) {}

export class DepartmentsResponseDto extends createZodDto(
    DepartmentsResponseSchema,
) {}
