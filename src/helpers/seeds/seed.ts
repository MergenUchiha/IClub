import { PrismaClient } from '@prisma/client';
import { seedDepartment } from './department.seed';

const prisma = new PrismaClient();

async function main() {
    const startedAt = Date.now();
    console.log('Seeding...');

    await seedDepartment(prisma);

    const seconds = ((Date.now() - startedAt) / 1000).toFixed(2);
    console.log(`Seeding finished in ${seconds}s`);
}

main()
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());
