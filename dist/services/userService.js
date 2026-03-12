"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = exports.UserService = void 0;
const prisma_1 = require("../lib/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const SALT_ROUNDS = 10;
class UserService {
    constructor(prisma) {
        this.prisma = prisma;
    }
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
        return this.prisma.user.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
    }
    async findById(id) {
        return this.prisma.user.findUnique({
            where: { id },
            include: {
                subjects: true,
                studies: true,
                goals: true,
                notes: true,
            },
        });
    }
    async findByEmail(email) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }
    async findByEmailWithPassword(email) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }
    async hashPassword(password) {
        return bcrypt_1.default.hash(password, SALT_ROUNDS);
    }
    async comparePassword(password, hash) {
        return bcrypt_1.default.compare(password, hash);
    }
    async create(data) {
        return this.prisma.user.create({
            data: {
                email: data.email,
            },
        });
    }
    async createWithPassword(email, password) {
        const hashedPassword = await this.hashPassword(password);
        return this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });
    }
    async update(id, data) {
        return this.prisma.user.update({
            where: { id },
            data,
        });
    }
    async delete(id) {
        return this.prisma.user.delete({
            where: { id },
        });
    }
    async updatePassword(id, newPassword) {
        const hashedPassword = await this.hashPassword(newPassword);
        return this.prisma.user.update({
            where: { id },
            data: { password: hashedPassword },
        });
    }
}
exports.UserService = UserService;
exports.userService = new UserService(prisma_1.Prisma);
