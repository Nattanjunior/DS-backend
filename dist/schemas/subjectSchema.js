"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subjectQuerySchema = exports.subjectParamsSchema = exports.updateSubjectSchema = exports.createSubjectSchema = void 0;
const zod_1 = require("zod");
exports.createSubjectSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Nome é obrigatório').max(255),
    userId: zod_1.z.string().uuid('ID de usuário inválido'),
});
exports.updateSubjectSchema = exports.createSubjectSchema.partial();
exports.subjectParamsSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('ID inválido'),
});
exports.subjectQuerySchema = zod_1.z.object({
    userId: zod_1.z.string().uuid('ID de usuário inválido').optional(),
    name: zod_1.z.string().optional(),
});
