"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noteService = exports.NoteService = void 0;
const prisma_1 = require("../lib/prisma");
class NoteService {
    constructor(prisma) {
        this.prisma = prisma;
    }
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
        return this.prisma.note.findMany({
            where,
            include: { subject: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findById(id) {
        return this.prisma.note.findUnique({
            where: { id },
            include: { subject: true },
        });
    }
    async create(data) {
        return this.prisma.note.create({
            data: {
                userId: data.userId,
                subjectId: data.subjectId,
                content: data.content,
            },
            include: { subject: true },
        });
    }
    async update(id, data) {
        return this.prisma.note.update({
            where: { id },
            data,
            include: { subject: true },
        });
    }
    async delete(id) {
        return this.prisma.note.delete({
            where: { id },
        });
    }
}
exports.NoteService = NoteService;
exports.noteService = new NoteService(prisma_1.Prisma);
