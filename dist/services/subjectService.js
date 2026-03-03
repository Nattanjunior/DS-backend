"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subjectService = void 0;
const prisma_js_1 = require("../lib/prisma.js");
exports.subjectService = {
    async findAll(query) {
        const where = {};
        if (query.userId)
            where.userId = query.userId;
        if (query.name)
            where.name = { contains: query.name, mode: 'insensitive' };
        return prisma_js_1.prisma.subject.findMany({
            where,
            orderBy: { name: 'asc' },
        });
    },
    async findById(id) {
        return prisma_js_1.prisma.subject.findUnique({
            where: { id },
        });
    },
    async create(data) {
        return prisma_js_1.prisma.subject.create({
            data: {
                name: data.name,
                userId: data.userId,
            },
        });
    },
    async update(id, data) {
        return prisma_js_1.prisma.subject.update({
            where: { id },
            data,
        });
    },
    async delete(id) {
        return prisma_js_1.prisma.subject.delete({
            where: { id },
        });
    },
};
