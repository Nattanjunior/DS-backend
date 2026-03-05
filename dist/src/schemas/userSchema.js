"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userQuerySchema = exports.userParamsSchema = exports.updateUserSchema = exports.createUserSchema = exports.loginUserSchema = exports.registerUserSchema = void 0;
const zod_1 = require("zod");
exports.registerUserSchema = zod_1.z.object({
    email: zod_1.z.string().email('Email inválido'),
    password: zod_1.z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});
exports.loginUserSchema = zod_1.z.object({
    email: zod_1.z.string().email('Email inválido'),
    password: zod_1.z.string().min(1, 'Senha é obrigatória'),
});
exports.createUserSchema = zod_1.z.object({
    email: zod_1.z.string().email('Email inválido').optional(),
});
exports.updateUserSchema = exports.createUserSchema.partial();
exports.userParamsSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('ID inválido'),
});
exports.userQuerySchema = zod_1.z.object({
    email: zod_1.z.string().optional(),
    createdAtFrom: zod_1.z.coerce.date().optional(),
    createdAtTo: zod_1.z.coerce.date().optional(),
});
