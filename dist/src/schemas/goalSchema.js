"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.goalQuerySchema = exports.goalParamsSchema = exports.updateGoalSchema = exports.createGoalSchema = void 0;
const zod_1 = require("zod");
const goalDaySchema = zod_1.z.object({
    weekday: zod_1.z.number().int().min(1).max(7, 'Dia da semana deve ser entre 1 e 7'),
    hours: zod_1.z.number().min(0, 'Horas não pode ser negativo'),
    subjectIds: zod_1.z.array(zod_1.z.string().uuid('ID de matéria inválido')).optional(),
});
exports.createGoalSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid('ID de usuário inválido'),
    type: zod_1.z.enum(['WEEKLY', 'MONTHLY']),
    totalHours: zod_1.z.number().positive('Horas totais deve ser maior que 0'),
    startDate: zod_1.z.coerce.date('Data de início inválida'),
    endDate: zod_1.z.coerce.date('Data de fim inválida'),
    days: zod_1.z.array(goalDaySchema).min(1, 'Ao menos um dia deve ser informado'),
});
exports.updateGoalSchema = zod_1.z.object({
    type: zod_1.z.enum(['WEEKLY', 'MONTHLY']).optional(),
    totalHours: zod_1.z.number().positive('Horas totais deve ser maior que 0').optional(),
    startDate: zod_1.z.coerce.date('Data de início inválida').optional(),
    endDate: zod_1.z.coerce.date('Data de fim inválida').optional(),
    days: zod_1.z.array(goalDaySchema).optional(),
});
exports.goalParamsSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('ID inválido'),
});
exports.goalQuerySchema = zod_1.z.object({
    userId: zod_1.z.string().uuid('ID de usuário inválido').optional(),
    type: zod_1.z.enum(['WEEKLY', 'MONTHLY']).optional(),
    startDate: zod_1.z.coerce.date().optional(),
    endDate: zod_1.z.coerce.date().optional(),
});
