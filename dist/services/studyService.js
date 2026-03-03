"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studyService = void 0;
const prisma_js_1 = require("../lib/prisma.js");
exports.studyService = {
    async findAll(query) {
        const where = {};
        if (query.userId)
            where.userId = query.userId;
        if (query.subjectId)
            where.subjectId = query.subjectId;
        if (query.dateFrom || query.dateTo) {
            where.date = {};
            if (query.dateFrom)
                where.date.gte = query.dateFrom;
            if (query.dateTo)
                where.date.lte = query.dateTo;
        }
        return prisma_js_1.prisma.study.findMany({
            where,
            include: { subject: true },
            orderBy: { date: 'desc' },
        });
    },
    async findById(id) {
        return prisma_js_1.prisma.study.findUnique({
            where: { id },
            include: { subject: true },
        });
    },
    async create(data) {
        return prisma_js_1.prisma.study.create({
            data: {
                userId: data.userId,
                subjectId: data.subjectId,
                hours: data.hours,
                date: data.date,
            },
            include: { subject: true },
        });
    },
    async update(id, data) {
        return prisma_js_1.prisma.study.update({
            where: { id },
            data,
            include: { subject: true },
        });
    },
    async delete(id) {
        return prisma_js_1.prisma.study.delete({
            where: { id },
        });
    },
};
