"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const authService_1 = require("../services/authService");
const userService_1 = require("../services/userService");
class AuthController {
    async register(request, reply) {
        try {
            const result = await authService_1.authService.register(request.body, request.server);
            return reply.status(201).send(result);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erro ao registrar';
            return reply.status(400).send({ error: message });
        }
    }
    async login(request, reply) {
        try {
            const result = await authService_1.authService.login(request.body, request.server);
            return reply.send(result);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erro ao fazer login';
            return reply.status(401).send({ error: message });
        }
    }
    async me(request, reply) {
        const userId = request.user.userId;
        const user = await userService_1.userService.findById(userId);
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
    async forgotPassword(request, reply) {
        try {
            const result = await authService_1.authService.forgotPassword(request.body);
            return reply.send(result);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erro ao processar solicitação';
            return reply.status(400).send({ error: message });
        }
    }
    async resetPassword(request, reply) {
        try {
            const result = await authService_1.authService.resetPassword(request.body);
            return reply.send(result);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erro ao redefinir senha';
            return reply.status(400).send({ error: message });
        }
    }
}
exports.AuthController = AuthController;
exports.authController = new AuthController();
