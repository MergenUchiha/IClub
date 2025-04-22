import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    UploadedFile,
} from '@nestjs/common';
import { ProductService } from './product.service';
import {
    CreateProductDto,
    TApiProductResponse,
    TApiProductsResponse,
    UpdateProductDto,
} from 'src/libs/contracts';
import { TApiResp } from 'src/libs/contracts/interface';
import { ImageTransformer } from 'src/common/pipe/imageTransform.pipe';
import { ITransformedFile } from 'src/common/interfaces/fileTransform.interface';
import { CreateProductOperation } from './decorator/createProductOperation.decorator';
import { GetProductsOperation } from './decorator/getProductsOperation.decorator';
import { GetOneProductOperation } from './decorator/getOneProductOperation.decorator';
import { UpdateProductOperation } from './decorator/updateProductOperation.decorator';
import { DeleteProductOperation } from './decorator/deleteProductOperation.decorator';
import { UploadProductImageOperation } from './decorator/uploadProductImageOperation.decorator';
import { DeleteProductImageOperation } from './decorator/deleteProductImageOperation.decorator';
import { PUBLIC } from 'src/common/decorators/isPublic.decorator';

@PUBLIC()
@Controller('product')
export class ProductController {
    constructor(private productService: ProductService) {}

    @CreateProductOperation()
    @Post()
    async createProduct(
        @Body() dto: CreateProductDto,
    ): Promise<TApiResp<TApiProductResponse>> {
        return this.productService.createProduct(dto);
    }

    @GetProductsOperation()
    @Get()
    async getProducts() // @Query() query: PageDto,
    : Promise<TApiResp<TApiProductsResponse>> {
        return this.productService.getProducts();
    }

    @GetOneProductOperation()
    @Get(':productId')
    async getOneProduct(
        @Param('productId', ParseUUIDPipe) productId: string,
    ): Promise<TApiResp<TApiProductResponse>> {
        return this.productService.getOneProduct(productId);
    }

    @UpdateProductOperation()
    @Patch(':productId')
    async updateProduct(
        @Param('productId', ParseUUIDPipe) productId: string,
        @Body() dto: UpdateProductDto,
    ): Promise<TApiResp<TApiProductResponse>> {
        return this.productService.updateProduct(productId, dto);
    }

    @DeleteProductOperation()
    @Delete(':productId')
    async deleteProduct(
        @Param('productId', ParseUUIDPipe) productId: string,
    ): Promise<TApiResp<true>> {
        return this.productService.deleteProduct(productId);
    }

    @UploadProductImageOperation()
    @Post(':productId/image')
    async uploadProductImage(
        @Param('productId', ParseUUIDPipe) productId: string,
        @UploadedFile(ImageTransformer) file: ITransformedFile,
    ) {
        return await this.productService.uploadProductImage(productId, file);
    }

    @DeleteProductImageOperation()
    @Delete(':productId/image')
    async deleteProductImage(
        @Param('productId', ParseUUIDPipe) productId: string,
    ): Promise<TApiResp<true>> {
        return await this.productService.deleteProductImage(productId);
    }
}
