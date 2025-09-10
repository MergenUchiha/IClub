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
} from '@nestjs/common';
import { CategoryService } from './category.service';
import {
    CreateCategoryDto,
    PageDto,
    TApiCategoriesResponse,
    TApiCategoryResponse,
    UpdateCategoryDto,
} from 'src/libs/contracts';
import { TApiResp } from 'src/libs/contracts/interface';
import { CreateCategoryOperation } from './decorator/createCategoryOperation.decorator';
import { GetCategoriesOperation } from './decorator/getCategoriesOperation.decorator';
import { GetOneCategoryOperation } from './decorator/getOneCategoryOperation.decorator';
import { UpdateCategoryOperation } from './decorator/updateCategoryOperation.decorator';
import { DeleteCategoryOperation } from './decorator/deleteCategoryOperation.decorator';
import { PUBLIC } from 'src/common/decorators/isPublic.decorator';

@PUBLIC()
@Controller('category')
export class CategoryController {
    constructor(private categoryService: CategoryService) {}

    @CreateCategoryOperation()
    @Post()
    async createCategory(
        @Body() dto: CreateCategoryDto,
    ): Promise<TApiResp<TApiCategoryResponse>> {
        return await this.categoryService.createCategory(dto);
    }

    @GetCategoriesOperation()
    @Get()
    async getCategories(
        @Query() query: PageDto,
    ): Promise<TApiResp<TApiCategoriesResponse>> {
        return await this.categoryService.getCategories(query);
    }

    @GetOneCategoryOperation()
    @Get(':categoryId')
    async getOneCategory(
        @Param('categoryId', ParseUUIDPipe) categoryId: string,
    ): Promise<TApiResp<TApiCategoryResponse>> {
        return await this.categoryService.getOneCategory(categoryId);
    }

    @UpdateCategoryOperation()
    @Patch(':categoryId')
    async updateCategory(
        @Param('categoryId', ParseUUIDPipe) categoryId: string,
        @Body() dto: UpdateCategoryDto,
    ): Promise<TApiResp<TApiCategoryResponse>> {
        return await this.categoryService.updateCategory(categoryId, dto);
    }

    @DeleteCategoryOperation()
    @Delete(':categoryId')
    async deleteCategory(
        @Param('categoryId', ParseUUIDPipe) categoryId: string,
    ): Promise<TApiResp<true>> {
        return await this.categoryService.deleteCategory(categoryId);
    }
}
