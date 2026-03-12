"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = exports.UserController = void 0;
const userService_1 = require("../services/userService");
class UserController {
    async getUsers(request, reply) {
        const users = await userService_1.userService.findAll(request.query);
        return reply.send({ data: users });
    }
    async getUserById(request, reply) {
        const user = await userService_1.userService.findById(request.params.id);
        if (!user) {
            return reply.status(404).send({ error: 'Usuário não encontrado' });
        }
        return reply.send({ data: user });
    }
    async createUser(request, reply) {
        const user = await userService_1.userService.create(request.body);
        return reply.status(201).send({ data: user });
    }
    async updateUser(request, reply) {
        try {
            const user = await userService_1.userService.update(request.params.id, request.body);
            return reply.send({ data: user });
        }
        catch {
            return reply.status(404).send({ error: 'Usuário não encontrado' });
        }
    }
    async deleteUser(request, reply) {
        try {
            await userService_1.userService.delete(request.params.id);
            return reply.status(204).send();
        }
        catch {
            return reply.status(404).send({ error: 'Usuário não encontrado' });
        }
    }
}
exports.UserController = UserController;
exports.userController = new UserController();
