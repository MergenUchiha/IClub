import { Module } from '@nestjs/common';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';
import { MediaModule } from 'src/libs/media/media.module';

@Module({
    imports: [MediaModule],
    controllers: [ShopController],
    providers: [ShopService],
})
export class ShopModule {}
