import { BadRequestException, Injectable } from '@nestjs/common';
import { join } from 'path';
import { ITransformedFile } from 'src/common/interfaces/fileTransform.interface';
import { promises as fs } from 'fs';
import {
    CreateImageDto,
    CreateProductDto,
    ImageResponseSchema,
    PageDto,
    ProductResponseSchema,
    ProductsResponseSchema,
    TApiImageResponse,
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
import { z } from 'zod';

@Injectable()
export class ProductService {
    constructor(
        private prisma: PrismaService,
        private mediaService: MediaService,
    ) {}
    private fileSchema = z.object({
        originalName: z.string().min(1, 'Original name is required'),
        fileName: z.string().min(1, 'File name is required'),
        filePath: z.string().min(1, 'File path is required'),
        mimeType: z.string().refine((val) => val.startsWith('image/'), {
            message: 'File must be an image',
        }),
        size: z.string().refine((val) => parseInt(val) <= 1500 * 1024 * 1024, {
            message: 'File size must be less than 1.5GB',
        }),
        productId: z.string().uuid().optional(),
    });

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

    async createProductFileMedia(
        productId: string,
        file: ITransformedFile,
    ): Promise<TApiResp<TApiImageResponse>> {
        file.productId = productId;
        // Валидация файла
        try {
            this.fileSchema.parse(file);
        } catch (error) {
            console.error('Validation failed:', error);
            throw new BadRequestException(error);
        }

        const mediaData: CreateImageDto = {
            originalName: file.originalName,
            fileName: file.fileName,
            filePath: file.filePath,
            mimeType: file.mimeType,
            size: file.size,
            productId: file.productId,
        };

        const media = await this.prisma.image.create({
            data: mediaData,
        });
        const parsed = ImageResponseSchema.parse(media);

        return {
            good: true,
            response: parsed,
        };
    }

    async deleteMedia(productId: string) {
        console.log(`Удаление медиа с идентификатором продукта: ${productId}`);
        const file = await this.prisma.image.findFirst({
            where: { productId: productId },
        });
        if (!file) {
            console.warn(
                `Медиа с идентификатором продукта ${productId} не найдено!`,
            );
            throw new ImageNotFoundException();
        }

        const filePath = join(__dirname, '..', '..', file.filePath);
        await fs.unlink(filePath).catch((err) => {
            console.warn(`Не удалось удалить файл ${file.filePath}: ${err}`);
        });

        await this.prisma.image.delete({
            where: { id: file.id },
        });
        return true;
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
