import { Injectable } from '@nestjs/common';
import {
    DepartmentsResponseSchema,
    TApiDepartmentsResponse,
} from 'src/libs/contracts';
import { TApiResp } from 'src/libs/contracts/interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DepartmentService {
    constructor(private prisma: PrismaService) {}

    async getAllDepartments(): Promise<TApiResp<TApiDepartmentsResponse>> {
        const departments = await this.prisma.department.findMany();
        const parsed = DepartmentsResponseSchema.parse(departments);
        return {
            good: true,
            response: parsed,
        };
    }
}
