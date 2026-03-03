"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noteService = void 0;
const prisma_js_1 = require("../lib/prisma.js");
exports.noteService = {
    async findAll(query) {
        const where = {};
        if (query.userId)
            where.userId = query.userId;
        if (query.subjectId)
            where.subjectId = query.subjectId;
        if (query.dateFrom || query.dateTo) {
            where.createdAt = {};
            if (query.dateFrom)
                where.createdAt.gte = query.dateFrom;
            if (query.dateTo)
                where.createdAt.lte = query.dateTo;
        }
        return prisma_js_1.prisma.note.findMany({
            where,
            include: { subject: true },
            orderBy: { createdAt: 'desc' },
        });
    },
    async findById(id) {
        return prisma_js_1.prisma.note.findUnique({
            where: { id },
            include: { subject: true },
        });
    },
    async create(data) {
        return prisma_js_1.prisma.note.create({
            data: {
                userId: data.userId,
                subjectId: data.subjectId,
                content: data.content,
            },
            include: { subject: true },
        });
    },
    async update(id, data) {
        return prisma_js_1.prisma.note.update({
            where: { id },
            data,
            include: { subject: true },
        });
    },
    async delete(id) {
        return prisma_js_1.prisma.note.delete({
            where: { id },
        });
    },
};
