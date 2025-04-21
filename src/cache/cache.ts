// import { LoggerService } from 'src/utils/logger/logger.service';

// export class Cache<T> {
//     constructor(
//         private updateIntervalMs: number,
//         private getNewData: () => Promise<T>,
//         private logger: LoggerService,
//     ) {
//         this.name = 'defaultCacheName';
//     }

//     public name: string;
//     public data!: T;
//     private lastTimeUpdated = 0;

//     private tickIntervalMs = 500;

//     private onUpdateErrorCb = async (cache: Cache<T>, err: Error) =>
//         this.logger.error(`Error when updating cache ${cache.name}:`, 'Cache');

//     private async updateData() {
//         const newData = await this.getNewData();
//         this.data = newData;
//         this.lastTimeUpdated = Date.now();
//     }

//     private async updateWrapped(throwOnErr: boolean) {
//         try {
//             await this.updateData();
//         } catch (err) {
//             if (throwOnErr) throw err;
//             await this.onUpdateErrorCb(this, err as Error);
//         }
//     }

//     /** Updates cache and schedules next tickUpdate call */
//     public async tickUpdate(throwOnErr: boolean) {
//         const startTime = Date.now();

//         if (startTime - this.lastTimeUpdated > this.updateIntervalMs) {
//             try {
//                 await this.updateWrapped(throwOnErr);
//             } catch (err) {
//                 if (throwOnErr) throw err;
//                 this.logger.error(
//                     `At tickUpdate() for cache ${this.name}:`,
//                     'Cache',
//                 );
//             }
//         }

//         const endTime = Date.now();
//         const ms = this.tickIntervalMs - (endTime - startTime);
//         setTimeout(this.tickUpdate.bind(this) as any, ms);
//     }
// }
