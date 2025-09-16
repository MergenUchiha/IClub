import { PrismaClient } from '@prisma/client';
import { departments } from './data/department.data';

const prisma = new PrismaClient();

export async function seedDepartment() {
    for (const department of departments) {
        await prisma.department.create({
            data: {
                title: department.title,
            },
        });
    }

    console.log('Departments seeded successfully!');
}
