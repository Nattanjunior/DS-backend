"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.goalService = void 0;
const prisma_js_1 = require("../lib/prisma.js");
exports.goalService = {
    async findAll(query) {
        const where = {};
        if (query.userId)
            where.userId = query.userId;
        if (query.type)
            where.type = query.type;
        if (query.startDate || query.endDate) {
            where.startDate = {};
            where.endDate = {};
            if (query.startDate)
                where.startDate.lte = query.startDate;
            if (query.endDate)
                where.endDate.gte = query.endDate;
        }
        return prisma_js_1.prisma.goal.findMany({
            where,
            include: {
                days: {
                    include: {
                        subjects: {
                            include: { subject: true },
                        },
                    },
                },
            },
            orderBy: { startDate: 'desc' },
        });
    },
    async findById(id) {
        return prisma_js_1.prisma.goal.findUnique({
            where: { id },
            include: {
                days: {
                    include: {
                        subjects: {
                            include: { subject: true },
                        },
                    },
                },
            },
        });
    },
    async create(data) {
        const { userId, type, totalHours, startDate, endDate, days } = data;
        return prisma_js_1.prisma.goal.create({
            data: {
                userId,
                type,
                totalHours,
                startDate,
                endDate,
                days: {
                    create: days.map((day) => ({
                        weekday: day.weekday,
                        hours: day.hours,
                        subjects: day.subjectIds
                            ? {
                                create: day.subjectIds.map((subjectId) => ({
                                    subjectId,
                                })),
                            }
                            : undefined,
                    })),
                },
            },
            include: {
                days: {
                    include: {
                        subjects: {
                            include: { subject: true },
                        },
                    },
                },
            },
        });
    },
    async update(id, data) {
        const { type, totalHours, startDate, endDate, days } = data;
        if (days) {
            await prisma_js_1.prisma.goalDaySubject.deleteMany({
                where: { goalDay: { goalId: id } },
            });
            await prisma_js_1.prisma.goalDay.deleteMany({
                where: { goalId: id },
            });
        }
        return prisma_js_1.prisma.goal.update({
            where: { id },
            data: {
                type,
                totalHours,
                startDate,
                endDate,
                days: days
                    ? {
                        create: days.map((day) => ({
                            weekday: day.weekday,
                            hours: day.hours,
                            subjects: day.subjectIds
                                ? {
                                    create: day.subjectIds.map((subjectId) => ({
                                        subjectId,
                                    })),
                                }
                                : undefined,
                        })),
                    }
                    : undefined,
            },
            include: {
                days: {
                    include: {
                        subjects: {
                            include: { subject: true },
                        },
                    },
                },
            },
        });
    },
    async delete(id) {
        await prisma_js_1.prisma.goalDaySubject.deleteMany({
            where: { goalDay: { goalId: id } },
        });
        await prisma_js_1.prisma.goalDay.deleteMany({
            where: { goalId: id },
        });
        return prisma_js_1.prisma.goal.delete({
            where: { id },
        });
    },
};
