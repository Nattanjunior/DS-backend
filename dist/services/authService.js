"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const userService_js_1 = require("./userService.js");
const crypto_1 = require("crypto");
const passwordResets = new Map();
exports.authService = {
    async register(data, fastify) {
        const existingUser = await userService_js_1.userService.findByEmail(data.email);
        if (existingUser) {
            throw new Error('Email já cadastrado');
        }
        const user = await userService_js_1.userService.createWithPassword(data.email, data.password);
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
    },
    async login(data, fastify) {
        const user = await userService_js_1.userService.findByEmailWithPassword(data.email);
        if (!user) {
            throw new Error('Credenciais inválidas');
        }
        if (!user.password) {
            throw new Error('Credenciais inválidas');
        }
        const isValidPassword = await userService_js_1.userService.comparePassword(data.password, user.password);
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
    },
    async forgotPassword(data) {
        const user = await userService_js_1.userService.findByEmail(data.email);
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
    },
    async resetPassword(data) {
        const resetData = passwordResets.get(data.token);
        if (!resetData) {
            throw new Error('Token inválido');
        }
        if (resetData.expiresAt < new Date()) {
            passwordResets.delete(data.token);
            throw new Error('Token expirado');
        }
        const user = await userService_js_1.userService.findById(resetData.userId);
        if (!user) {
            throw new Error('Usuário não encontrado');
        }
        await userService_js_1.userService.updatePassword(user.id, data.newPassword);
        passwordResets.delete(data.token);
        return { message: 'Senha atualizada com sucesso' };
    },
};
