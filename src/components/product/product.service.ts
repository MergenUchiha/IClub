import { Injectable } from '@nestjs/common';
import { ITransformedFile } from 'src/common/interfaces/fileTransform.interface';
import {
    CreateProductDto,
    PageDto,
    ProductResponseSchema,
    ProductsResponseSchema,
    TApiProductResponse,
    TApiProductsResponse,
    UpdateProductDto,
} from 'src/libs/contracts';
import {
    ImageNotFoundException,
    ProductNotFoundException,
} from 'src/libs/contracts/exceptions';
import { TApiResp } from 'src/libs/contracts/interface';
import { MediaService } from 'src/libs/media/media.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
    constructor(
        private prisma: PrismaService,
        private mediaService: MediaService,
    ) {}
    async createProduct(
        dto: CreateProductDto,
    ): Promise<TApiResp<TApiProductResponse>> {
        const product = await this.prisma.product.create({ data: { ...dto } });
        const parsed = ProductResponseSchema.parse(product);
        return {
            good: true,
            response: parsed,
        };
    }

    async getProducts(query: PageDto): Promise<TApiResp<TApiProductsResponse>> {
        const { page = 1, take = 5, q = '' } = query;
        const products = await this.prisma.product.findMany({
            where: { name: { contains: q } },
            orderBy: { name: 'asc' },
            take,
            skip: (page - 1) * take,
            include: { images: true },
        });
        const parsed = ProductsResponseSchema.parse(products);
        return { good: true, response: parsed };
    }

    async getOneProduct(
        productId: string,
    ): Promise<TApiResp<TApiProductResponse>> {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
            include: {
                images: true,
            },
        });
        if (!product) {
            throw new ProductNotFoundException();
        }
        const parsed = ProductResponseSchema.parse(product);
        return { good: true, response: parsed };
    }

    async updateProduct(
        productId: string,
        dto: UpdateProductDto,
    ): Promise<TApiResp<TApiProductResponse>> {
        await this.findProductById(productId);
        const product = await this.prisma.product.update({
            where: { id: productId },
            data: { ...dto },
        });
        const parsed = ProductResponseSchema.parse(product);
        return {
            good: true,
            response: parsed,
        };
    }

    async deleteProduct(productId: string): Promise<TApiResp<true>> {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
            include: {
                images: {
                    select: { id: true },
                },
            },
        });
        if (!product) {
            throw new ProductNotFoundException();
        }
        const imageIdsToDelete: string[] = [
            ...product.images.map((image) => image.id),
        ];
        if (imageIdsToDelete.length > 0) {
            await this.mediaService.deleteMedias(imageIdsToDelete);
        }

        await this.prisma.product.delete({
            where: { id: productId },
        });

        return {
            good: true,
        };
    }

    async uploadProductImage(
        productId: string,
        file: ITransformedFile,
    ): Promise<TApiResp<true>> {
        await this.findProductById(productId);
        file.productId = productId;
        await this.mediaService.createProductFileMedia(file);
        return { good: true };
    }

    async deleteProductImage(imageId: string): Promise<TApiResp<true>> {
        await this.findImageById(imageId);
        await this.mediaService.deleteMedia(imageId);
        return { good: true };
    }

    private async findImageById(imageId: string) {
        const image = await this.prisma.image.findUnique({
            where: { id: imageId },
        });
        if (!image) {
            throw new ImageNotFoundException();
        }
    }

    private async findProductById(productId: string) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new ProductNotFoundException();
        }
        return product;
    }
}
