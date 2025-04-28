import { Injectable } from '@nestjs/common';
import { Image } from '@prisma/client';
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
    CategoryNotFoundException,
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
        await this.findCategoryById(dto.categoryId);
        const product = await this.prisma.product.create({
            data: {
                name: dto.name,
                description: dto.description,
                price: dto.price,
                categoryId: dto.categoryId,
            },
        });
        const parsed = ProductResponseSchema.parse(product);
        return {
            good: true,
            response: parsed,
        };
    }

    async getProducts(query: PageDto): Promise<TApiResp<TApiProductsResponse>> {
        const { page = 1, take = 5, q = '', order = 'desc' } = query;
        const products = await this.prisma.product.findMany({
            where: { name: { contains: q } },
            orderBy: { name: order },
            take,
            skip: (page - 1) * take,
            include: { image: true },
        });
        const count = await this.prisma.product.count();
        const parsed = ProductsResponseSchema.parse(products);
        return { good: true, response: parsed, count: count };
    }

    async getOneProduct(
        productId: string,
    ): Promise<TApiResp<TApiProductResponse>> {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
            include: {
                image: true,
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
                image: {
                    select: { id: true },
                },
            },
        });
        if (!product) {
            throw new ProductNotFoundException();
        }
        // Handle single image deletion if it exists
        if (product.image) {
            await this.mediaService.deleteMedias([product.image.id]);
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

    async deleteProductImage(productId: string): Promise<TApiResp<true>> {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
            include: {
                image: true,
            },
        });
        if (!product) {
            throw new ProductNotFoundException();
        }
        let image: Image;
        if (product.image) {
            image = await this.findImageById(product.image.id);
            await this.mediaService.deleteMedia(image.id);
        }
        return { good: true };
    }

    private async findImageById(imageId: string) {
        const image = await this.prisma.image.findUnique({
            where: { id: imageId },
        });
        if (!image) {
            throw new ImageNotFoundException();
        }
        return image;
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

    private async findCategoryById(categoryId: string) {
        const category = await this.prisma.category.findUnique({
            where: { id: categoryId },
        });
        if (!category) {
            throw new CategoryNotFoundException();
        }
        return category;
    }
}
