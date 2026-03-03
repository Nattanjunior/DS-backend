"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGoals = getGoals;
exports.getGoalById = getGoalById;
exports.createGoal = createGoal;
exports.updateGoal = updateGoal;
exports.deleteGoal = deleteGoal;
const goalService_js_1 = require("../services/goalService.js");
async function getGoals(request, reply) {
    const goals = await goalService_js_1.goalService.findAll(request.query);
    return reply.send({ data: goals });
}
async function getGoalById(request, reply) {
    const goal = await goalService_js_1.goalService.findById(request.params.id);
    if (!goal) {
        return reply.status(404).send({ error: 'Meta não encontrada' });
    }
    return reply.send({ data: goal });
}
async function createGoal(request, reply) {
    const goal = await goalService_js_1.goalService.create(request.body);
    return reply.status(201).send({ data: goal });
}
async function updateGoal(request, reply) {
    try {
        const goal = await goalService_js_1.goalService.update(request.params.id, request.body);
        return reply.send({ data: goal });
    }
    catch {
        return reply.status(404).send({ error: 'Meta não encontrada' });
    }
}
async function deleteGoal(request, reply) {
    try {
        await goalService_js_1.goalService.delete(request.params.id);
        return reply.status(204).send();
    }
    catch {
        return reply.status(404).send({ error: 'Meta não encontrada' });
    }
}
