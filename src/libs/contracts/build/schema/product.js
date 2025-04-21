"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsResponseSchema = exports.ProductResponseSchema = exports.ProductUpdateRequestSchema = exports.ProductCreateRequestSchema = void 0;
const zod_1 = require("zod");
exports.ProductCreateRequestSchema = zod_1.z.object({
    name: zod_1.z.string({
        required_error: 'Name is required!',
    }),
    categoryId: zod_1.z
        .string({
        required_error: 'Category ID is required!',
    })
        .uuid(),
    isEnable: zod_1.z.boolean().nullable(),
});
exports.ProductUpdateRequestSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    isEnable: zod_1.z.boolean().optional(),
});
exports.ProductResponseSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    name: zod_1.z.string({
        required_error: 'Name is required!',
    }),
    imageId: zod_1.z.string().uuid().nullable().optional(),
    isEnable: zod_1.z.boolean().nullable().optional(),
});
exports.ProductsResponseSchema = zod_1.z.array(exports.ProductResponseSchema);
