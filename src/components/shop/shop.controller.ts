import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    Query,
    UploadedFile,
} from '@nestjs/common';
import {
    CreateShopDto,
    PageDto,
    TApiShopResponse,
    TApiShopsResponse,
    UpdateShopDto,
} from 'src/libs/contracts';
import { TApiResp } from 'src/libs/contracts/interface';
import { ShopService } from './shop.service';
import { CreateShopOperation } from './decorator/createShopOperation.decorator';
import { GetShopsOperation } from './decorator/getShopsOperation.decorator';
import { GetOneShopOperation } from './decorator/getOneShopOperation.decorator';
import { UpdateShopOperation } from './decorator/updateShopOperation.decorator';
import { DeleteShopOperation } from './decorator/deleteShopOperation.decorator';
import { ITransformedFile } from 'src/common/interfaces/fileTransform.interface';
import { ImageTransformer } from 'src/common/pipe/imageTransform.pipe';
import { DeleteShopImageOperation } from './decorator/deleteShopImageOperation.decorator';
import { UploadShopImageOperation } from './decorator/uploadShopImageOperation.decorator';

@Controller('shop')
export class ShopController {
    constructor(private shopService: ShopService) {}

    @CreateShopOperation()
    @Post()
    async createShop(
        @Body() dto: CreateShopDto,
    ): Promise<TApiResp<TApiShopResponse>> {
        return this.shopService.createShop(dto);
    }

    @GetShopsOperation()
    @Get()
    async getShops(
        @Query() query: PageDto,
    ): Promise<TApiResp<TApiShopsResponse>> {
        return this.shopService.getShops(query);
    }

    @GetOneShopOperation()
    @Get(':shopId')
    async getOneShop(
        @Param('shopId', ParseUUIDPipe) shopId: string,
    ): Promise<TApiResp<TApiShopResponse>> {
        return this.shopService.getOneShop(shopId);
    }

    @UpdateShopOperation()
    @Patch(':shopId')
    async updateShop(
        @Param('shopId', ParseUUIDPipe) shopId: string,
        @Body() dto: UpdateShopDto,
    ): Promise<TApiResp<TApiShopResponse>> {
        return this.shopService.updateShop(shopId, dto);
    }

    @DeleteShopOperation()
    @Delete(':shopId')
    async deleteShop(
        @Param('shopId', ParseUUIDPipe) shopId: string,
    ): Promise<TApiResp<true>> {
        return this.shopService.deleteShop(shopId);
    }

    @UploadShopImageOperation()
    @Post(':shopId/image')
    async uploadShopImage(
        @Param('shopId', ParseUUIDPipe) shopId: string,
        @UploadedFile(ImageTransformer) file: ITransformedFile,
    ) {
        return await this.shopService.uploadShopImage(shopId, file);
    }

    @DeleteShopImageOperation()
    @Delete(':shopId/image/:imageId')
    async deleteShopImage(
        @Param('imageId', ParseUUIDPipe) imageId: string,
    ): Promise<TApiResp<true>> {
        return await this.shopService.deleteShopImage(imageId);
    }
}
