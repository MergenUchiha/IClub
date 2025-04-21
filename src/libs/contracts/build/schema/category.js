"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesResponseSchema = exports.DetailedCategoryResponseSchema = exports.CategoryResponseSchema = exports.CategoryCreateRequestSchema = void 0;
const zod_1 = require("zod");
const product_1 = require("./product");
exports.CategoryCreateRequestSchema = zod_1.z.object({
    title: zod_1.z.string({
        required_error: 'Title is required!',
    }),
});
exports.CategoryResponseSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    title: zod_1.z.string({
        required_error: 'Title is required!',
    }),
});
exports.DetailedCategoryResponseSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    title: zod_1.z.string(),
    Products: zod_1.z.array(product_1.ProductResponseSchema).optional(),
});
exports.CategoriesResponseSchema = zod_1.z.array(exports.CategoryResponseSchema);
