"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
const userService_js_1 = require("../services/userService.js");
async function getUsers(request, reply) {
    const users = await userService_js_1.userService.findAll(request.query);
    return reply.send({ data: users });
}
async function getUserById(request, reply) {
    const user = await userService_js_1.userService.findById(request.params.id);
    if (!user) {
        return reply.status(404).send({ error: 'Usuário não encontrado' });
    }
    return reply.send({ data: user });
}
async function createUser(request, reply) {
    const user = await userService_js_1.userService.create(request.body);
    return reply.status(201).send({ data: user });
}
async function updateUser(request, reply) {
    try {
        const user = await userService_js_1.userService.update(request.params.id, request.body);
        return reply.send({ data: user });
    }
    catch {
        return reply.status(404).send({ error: 'Usuário não encontrado' });
    }
}
async function deleteUser(request, reply) {
    try {
        await userService_js_1.userService.delete(request.params.id);
        return reply.status(204).send();
    }
    catch {
        return reply.status(404).send({ error: 'Usuário não encontrado' });
    }
}
