"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noteQuerySchema = exports.noteParamsSchema = exports.updateNoteSchema = exports.createNoteSchema = void 0;
const zod_1 = require("zod");
exports.createNoteSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid('ID de usuário inválido'),
    subjectId: zod_1.z.string().uuid('ID de matéria inválido').nullable().optional(),
    content: zod_1.z.string().min(1, 'Conteúdo é obrigatório'),
});
exports.updateNoteSchema = exports.createNoteSchema.partial();
exports.noteParamsSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('ID inválido'),
});
exports.noteQuerySchema = zod_1.z.object({
    userId: zod_1.z.string().uuid('ID de usuário inválido').optional(),
    subjectId: zod_1.z.string().uuid('ID de matéria inválido').optional(),
    dateFrom: zod_1.z.coerce.date().optional(),
    dateTo: zod_1.z.coerce.date().optional(),
});
