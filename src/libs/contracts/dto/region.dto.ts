import { createZodDto } from 'nestjs-zod';
import {
    RegionCreateRequestSchema,
    RegionUpdateRequestSchema,
} from '../schema';

export class CreateRegionDto extends createZodDto(RegionCreateRequestSchema) {}

export class UpdateRegionDto extends createZodDto(RegionUpdateRequestSchema) {}
