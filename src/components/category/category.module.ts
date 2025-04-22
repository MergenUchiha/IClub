import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { MediaModule } from 'src/libs/media/media.module';

@Module({
    imports: [MediaModule],
    controllers: [CategoryController],
    providers: [CategoryService],
})
export class CategoryModule {}
