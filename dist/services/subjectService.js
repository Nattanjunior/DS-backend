"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subjectService = exports.SubjectService = void 0;
const prisma_1 = require("../lib/prisma");
class SubjectService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.subject.findMany({
            orderBy: { name: 'asc' },
        });
    }
    async findById(id) {
        return this.prisma.subject.findUnique({
            where: { id },
        });
    }
    async findByUserId(userId) {
        return this.prisma.subject.findMany({
            where: { userId },
            orderBy: { name: 'asc' },
        });
    }
    async create(data, userId) {
        return this.prisma.subject.create({
            data: {
                name: data.name,
                userId: userId,
            },
        });
    }
    async update(id, data) {
        return this.prisma.subject.update({
            where: { id },
            data,
        });
    }
    async delete(id) {
        return this.prisma.subject.delete({
            where: { id },
        });
    }
}
exports.SubjectService = SubjectService;
exports.subjectService = new SubjectService(prisma_1.Prisma);
