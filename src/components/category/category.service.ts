import { Injectable } from '@nestjs/common';
import { Image, Product } from '@prisma/client';
import {
    CategoriesResponseSchema,
    CategoryResponseSchema,
    CreateCategoryDto,
    PageDto,
    TApiCategoriesResponse,
    TApiCategoryResponse,
    UpdateCategoryDto,
} from 'src/libs/contracts';
import {
    CategoryNameAlreadyExistsException,
    CategoryNotFoundException,
} from 'src/libs/contracts/exceptions';
import { TApiResp } from 'src/libs/contracts/interface';
import { MediaService } from 'src/libs/media/media.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
    constructor(
        private prisma: PrismaService,
        private mediaService: MediaService,
    ) {}

    async createCategory(
        dto: CreateCategoryDto,
    ): Promise<TApiResp<TApiCategoryResponse>> {
        await this.isTitleExist(dto.title);
        const category = await this.prisma.category.create({
            data: {
                title: dto.title,
            },
        });
        const parsed = CategoryResponseSchema.parse(category);
        return { good: true, response: parsed };
    }

    async getCategories(
        query: PageDto,
    ): Promise<TApiResp<TApiCategoriesResponse>> {
        const { page = 1, take = 5, q = '', order = 'asc' } = query;
        const where = { title: { contains: q } };
        const categories = await this.prisma.category.findMany({
            where,
            orderBy: { title: order },
            take,
            skip: (page - 1) * take,
        });
        const count = await this.prisma.category.count({ where });
        const parsed = CategoriesResponseSchema.parse(categories);
        return { good: true, response: parsed, count };
    }

    async getOneCategory(
        categoryId: string,
    ): Promise<TApiResp<TApiCategoryResponse>> {
        const category = await this.prisma.category.findUnique({
            where: { id: categoryId },
            include: {
                products: { include: { image: true } },
            },
        });
        if (!category) {
            throw new CategoryNotFoundException();
        }
        const parsed = CategoryResponseSchema.parse(category);
        return { good: true, response: parsed };
    }

    async updateCategory(
        categoryId: string,
        dto: UpdateCategoryDto,
    ): Promise<TApiResp<TApiCategoryResponse>> {
        await this.findCategoryById(categoryId);
        await this.isTitleExist(dto.title, categoryId);
        const category = await this.prisma.category.update({
            where: { id: categoryId },
            data: { title: dto.title },
        });
        const parsed = CategoryResponseSchema.parse(category);
        return {
            good: true,
            response: parsed,
        };
    }

    async deleteCategory(categoryId: string): Promise<TApiResp<true>> {
        const category = await this.prisma.category.findUnique({
            where: { id: categoryId },
            include: {
                products: {
                    include: {
                        image: {
                            select: { id: true },
                        },
                    },
                },
            },
        });

        // Make sure the category exists before touching anything.
        if (!category) {
            throw new CategoryNotFoundException();
        }

        // Collect the image ids belonging to the products in this category.
        const imageIdsToDelete = category.products
            .filter(
                (product): product is Product & { image: Image } =>
                    product.image !== null,
            )
            .map((product) => product.image.id);

        // Remove the images first: they live on disk as well as in the
        // database.
        if (imageIdsToDelete.length > 0) {
            await this.mediaService.deleteMedias(imageIdsToDelete);
        }

        // Then the products.
        if (category.products.length > 0) {
            await this.prisma.product.deleteMany({
                where: { categoryId },
            });
        }

        // And finally the category itself.
        await this.prisma.category.delete({
            where: { id: categoryId },
        });

        return { good: true };
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

    /**
     * `ownerId` is the category being renamed, if any: keeping its own title
     * is not a conflict, and rejecting it made every update that did not
     * change the title fail.
     */
    private async isTitleExist(title: string, ownerId?: string) {
        const category = await this.prisma.category.findUnique({
            where: { title: title },
        });
        if (category && category.id !== ownerId) {
            throw new CategoryNameAlreadyExistsException();
        }
    }
}
