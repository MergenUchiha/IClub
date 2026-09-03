import { PrismaClient } from '@prisma/client';
import { departments } from './data/department.data';

/**
 * Departments are a fixed reference list, so the table is replaced wholesale
 * rather than merged.
 */
export async function seedDepartment(prisma: PrismaClient) {
    await prisma.department.deleteMany();
    await prisma.department.createMany({ data: departments });

    console.log(`Seeded ${departments.length} departments`);
}
