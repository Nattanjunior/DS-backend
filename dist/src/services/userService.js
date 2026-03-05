"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const prisma_js_1 = require("../lib/prisma.js");
const bcrypt_1 = __importDefault(require("bcrypt"));
const SALT_ROUNDS = 10;
exports.userService = {
    async findAll(query) {
        const where = {};
        if (query.email) {
            where.email = { contains: query.email, mode: 'insensitive' };
        }
        if (query.createdAtFrom || query.createdAtTo) {
            where.createdAt = {};
            if (query.createdAtFrom)
                where.createdAt.gte = query.createdAtFrom;
            if (query.createdAtTo)
                where.createdAt.lte = query.createdAtTo;
        }
        return prisma_js_1.prisma.user.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
    },
    async findById(id) {
        return prisma_js_1.prisma.user.findUnique({
            where: { id },
            include: {
                subjects: true,
                studies: true,
                goals: true,
                notes: true,
            },
        });
    },
    async findByEmail(email) {
        return prisma_js_1.prisma.user.findUnique({
            where: { email },
        });
    },
    async findByEmailWithPassword(email) {
        return prisma_js_1.prisma.user.findUnique({
            where: { email },
        });
    },
    async hashPassword(password) {
        return bcrypt_1.default.hash(password, SALT_ROUNDS);
    },
    async comparePassword(password, hash) {
        return bcrypt_1.default.compare(password, hash);
    },
    async create(data) {
        return prisma_js_1.prisma.user.create({
            data: {
                email: data.email,
            },
        });
    },
    async createWithPassword(email, password) {
        const hashedPassword = await this.hashPassword(password);
        return prisma_js_1.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });
    },
    async update(id, data) {
        return prisma_js_1.prisma.user.update({
            where: { id },
            data,
        });
    },
    async delete(id) {
        return prisma_js_1.prisma.user.delete({
            where: { id },
        });
    },
};
