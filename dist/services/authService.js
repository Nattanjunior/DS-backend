"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const prisma_1 = require("../lib/prisma");
const userService_1 = require("./userService");
const crypto_1 = require("crypto");
const passwordResets = new Map();
class AuthService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async register(data, fastify) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: data.email }
        });
        if (existingUser) {
            throw new Error('Email já cadastrado');
        }
        const hashedPassword = await userService_1.userService.hashPassword(data.password);
        const user = await this.prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
            },
        });
        const payload = {
            userId: user.id,
            email: user.email || '',
        };
        const accessToken = fastify.jwt.sign(payload);
        return {
            user: {
                id: user.id,
                email: user.email,
                createdAt: user.createdAt,
            },
            accessToken,
        };
    }
    async login(data, fastify) {
        const user = await this.prisma.user.findUnique({
            where: { email: data.email }
        });
        if (!user) {
            throw new Error('Credenciais inválidas');
        }
        if (!user.password) {
            throw new Error('Credenciais inválidas');
        }
        const isValidPassword = await userService_1.userService.comparePassword(data.password, user.password);
        if (!isValidPassword) {
            throw new Error('Credenciais inválidas');
        }
        const payload = {
            userId: user.id,
            email: user.email || '',
        };
        const accessToken = fastify.jwt.sign(payload);
        return {
            user: {
                id: user.id,
                email: user.email,
                createdAt: user.createdAt,
            },
            accessToken,
        };
    }
    async forgotPassword(data) {
        const user = await this.prisma.user.findUnique({
            where: { email: data.email }
        });
        if (!user) {
            return { message: 'Se o email existir, um link de recuperação será enviado' };
        }
        const token = (0, crypto_1.randomBytes)(32).toString('hex');
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
        passwordResets.set(token, {
            userId: user.id,
            token,
            expiresAt,
        });
        return {
            message: 'Se o email existir, um link de recuperação será enviado',
            resetToken: token,
        };
    }
    async resetPassword(data) {
        const resetData = passwordResets.get(data.token);
        if (!resetData) {
            throw new Error('Token inválido');
        }
        if (resetData.expiresAt < new Date()) {
            passwordResets.delete(data.token);
            throw new Error('Token expirado');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: resetData.userId }
        });
        if (!user) {
            throw new Error('Usuário não encontrado');
        }
        const hashedPassword = await userService_1.userService.hashPassword(data.newPassword);
        await this.prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword },
        });
        passwordResets.delete(data.token);
        return { message: 'Senha atualizada com sucesso' };
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService(prisma_1.Prisma);
