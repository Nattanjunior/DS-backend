"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const userService_js_1 = require("./userService.js");
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
};
