import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { MediaModule } from 'src/libs/media/media.module';

@Module({
    imports: [MediaModule],
    controllers: [ProductController],
    providers: [ProductService],
})
export class ProductModule {}
