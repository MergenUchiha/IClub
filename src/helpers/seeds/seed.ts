// import { PrismaClient } from '@prisma/client';
// import { createCategories } from './categories.seed';
// import { createProducts } from './products.seed';
// import { createUserProducts } from './users.seed';
// import { createUserProduct } from './userProducts.seed';

// const prisma = new PrismaClient();

// console.log('Seeding...');
// const startTime = new Date();

// async function main() {
//     prisma.$connect;
//     await prisma.userProduct.deleteMany();
//     await prisma.user.deleteMany();
//     await prisma.product.deleteMany();
//     await prisma.category.deleteMany();
//     await createCategories();
//     await createProducts();
//     await createUserProducts();
//     await createUserProduct();
// }

// main()
//     .catch((e) => {
//         console.error(e);
//         process.exit(1);
//     })
//     .finally(async () => {
//         await prisma.$disconnect();
//         const endTime = new Date();
//         const timeDiff = (endTime.getTime() - startTime.getTime()) / 1000;
//         console.log(`Seeding finished. Time taken: ${timeDiff} seconds`);
//     });
