"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studyQuerySchema = exports.studyParamsSchema = exports.updateStudySchema = exports.createStudySchema = void 0;
const zod_1 = require("zod");
exports.createStudySchema = zod_1.z.object({
    userId: zod_1.z.string().uuid('ID de usuário inválido'),
    subjectId: zod_1.z.string().uuid('ID de matéria inválido').nullable().optional(),
    hours: zod_1.z.number().positive('Horas deve ser maior que 0'),
    date: zod_1.z.coerce.date('Data inválida'),
});
exports.updateStudySchema = exports.createStudySchema.partial();
exports.studyParamsSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('ID inválido'),
});
exports.studyQuerySchema = zod_1.z.object({
    userId: zod_1.z.string().uuid('ID de usuário inválido').optional(),
    subjectId: zod_1.z.string().uuid('ID de matéria inválido').optional(),
    dateFrom: zod_1.z.coerce.date().optional(),
    dateTo: zod_1.z.coerce.date().optional(),
});
