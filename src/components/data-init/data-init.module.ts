import { Module } from '@nestjs/common';
import { DataInitService } from './data-init.service';

@Module({
    providers: [DataInitService],
})
export class DataInitModule {}
