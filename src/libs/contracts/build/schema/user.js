"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResponseSchema = exports.UserUpdateRequestSchema = void 0;
const zod_1 = require("zod");
const UserCreateRequestSchema = zod_1.z.object({
    userName: zod_1.z.string({
        required_error: 'Username is required!',
    }),
    createdAt: zod_1.z.string().datetime({ offset: true }),
    updatedAt: zod_1.z.string().datetime({ offset: true }),
});
exports.UserUpdateRequestSchema = zod_1.z.object({
    userName: zod_1.z.string().optional(),
});
exports.UserResponseSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    userName: zod_1.z.string().nullable(),
    createdAt: zod_1.z.string().datetime({ offset: true }),
    updatedAt: zod_1.z.string().datetime({ offset: true }),
});
