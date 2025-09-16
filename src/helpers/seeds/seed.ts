import { PrismaClient } from '@prisma/client';
import { seedDepartment } from './department.seed';

const prisma = new PrismaClient();

console.log('Seeding...');
const startTime = new Date();

async function main() {
    prisma.$connect;
    await prisma.department.deleteMany();
    await seedDepartment();
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        const endTime = new Date();
        const timeDiff = (endTime.getTime() - startTime.getTime()) / 1000;
        console.log(`Seeding finished. Time taken: ${timeDiff} seconds`);
    });
