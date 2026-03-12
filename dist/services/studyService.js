"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studyService = exports.StudyService = void 0;
const prisma_1 = require("../lib/prisma");
class StudyService {
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
            where.date = {};
            if (query.dateFrom)
                where.date.gte = query.dateFrom;
            if (query.dateTo)
                where.date.lte = query.dateTo;
        }
        return this.prisma.study.findMany({
            where,
            include: { subject: true },
            orderBy: { date: 'desc' },
        });
    }
    async findById(id) {
        return this.prisma.study.findUnique({
            where: { id },
            include: { subject: true },
        });
    }
    async create(data) {
        return this.prisma.study.create({
            data: {
                userId: data.userId,
                subjectId: data.subjectId,
                hours: data.hours,
                date: data.date,
            },
            include: { subject: true },
        });
    }
    async update(id, data) {
        return this.prisma.study.update({
            where: { id },
            data,
            include: { subject: true },
        });
    }
    async delete(id) {
        return this.prisma.study.delete({
            where: { id },
        });
    }
}
exports.StudyService = StudyService;
exports.studyService = new StudyService(prisma_1.Prisma);
