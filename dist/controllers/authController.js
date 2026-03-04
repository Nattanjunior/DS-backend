"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.me = me;
const authService_js_1 = require("../services/authService.js");
const userService_js_1 = require("../services/userService.js");
async function register(request, reply) {
    try {
        const result = await authService_js_1.authService.register(request.body, request.server);
        return reply.status(201).send(result);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Erro ao registrar';
        return reply.status(400).send({ error: message });
    }
}
async function login(request, reply) {
    try {
        const result = await authService_js_1.authService.login(request.body, request.server);
        return reply.send(result);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Erro ao fazer login';
        return reply.status(401).send({ error: message });
    }
}
async function me(request, reply) {
    const userId = request.user.userId;
    const user = await userService_js_1.userService.findById(userId);
    if (!user) {
        return reply.status(404).send({ error: 'Usuário não encontrado' });
    }
    return reply.send({
        user: {
            id: user.id,
            email: user.email,
            createdAt: user.createdAt,
        },
    });
}
