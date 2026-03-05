"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userQuerySchema = exports.userParamsSchema = exports.updateUserSchema = exports.createUserSchema = exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.loginUserSchema = exports.registerUserSchema = void 0;
const zod_1 = require("zod");
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const robustEmailSchema = zod_1.z.string()
    .min(1, 'Email é obrigatório')
    .refine((email) => emailRegex.test(email), 'Email inválido. Formato esperado: usuario@dominio.com');
const passwordSchema = zod_1.z.string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
    .max(100, 'Senha deve ter no máximo 100 caracteres')
    .refine((password) => /[A-Z]/.test(password), 'Senha deve conter pelo menos uma letra maiúscula')
    .refine((password) => /[a-z]/.test(password), 'Senha deve conter pelo menos uma letra minúscula')
    .refine((password) => /[0-9]/.test(password), 'Senha deve conter pelo menos um número');
exports.registerUserSchema = zod_1.z.object({
    email: robustEmailSchema,
    password: passwordSchema,
});
exports.loginUserSchema = zod_1.z.object({
    email: robustEmailSchema,
    password: zod_1.z.string().min(1, 'Senha é obrigatória'),
});
exports.forgotPasswordSchema = zod_1.z.object({
    email: robustEmailSchema,
});
exports.resetPasswordSchema = zod_1.z.object({
    token: zod_1.z.string().min(1, 'Token é obrigatório'),
    newPassword: passwordSchema,
});
exports.createUserSchema = zod_1.z.object({
    email: robustEmailSchema.optional(),
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
