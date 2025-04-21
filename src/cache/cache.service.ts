// import { Injectable } from '@nestjs/common';
// import { PrismaService } from 'src/prisma/prisma.service';
// import { LoggerService } from 'src/utils/logger/logger.service';
// import { Cache } from './cache';

// @Injectable()
// export class CacheService {
//     public caches;

//     constructor(
//         private logger: LoggerService,
//         private prisma: PrismaService,
//     ) {
//         this.caches = {
//             shopItemVariants: new Cache(
//                 10000,
//                 async () => {
//                     const variants = await this.prisma.category.findMany();
//                     return variants;
//                 },
//                 this.logger,
//             ),
//         };

//         for (const cacheName in this.caches)
//             this.caches[cacheName as keyof typeof this.caches].name = cacheName;
//     }

//     public async init() {
//         const promises = Object.values(this.caches).map((cache) =>
//             cache.tickUpdate(true),
//         );
//         await Promise.all(promises);

//         this.logger.log(
//             `Caches initialized: ${promises.length} pcs - ${Object.keys(this.caches).join(', ')}`,
//         );
//     }
// }
