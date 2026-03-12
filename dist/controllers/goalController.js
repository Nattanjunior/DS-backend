"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.goalController = exports.GoalController = void 0;
const goalService_1 = require("../services/goalService");
class GoalController {
    async getGoals(request, reply) {
        const goals = await goalService_1.goalService.findAll(request.query);
        return reply.send({ data: goals });
    }
    async getGoalById(request, reply) {
        const goal = await goalService_1.goalService.findById(request.params.id);
        if (!goal) {
            return reply.status(404).send({ error: 'Meta não encontrada' });
        }
        return reply.send({ data: goal });
    }
    async createGoal(request, reply) {
        const goal = await goalService_1.goalService.create(request.body);
        return reply.status(201).send({ data: goal });
    }
    async updateGoal(request, reply) {
        try {
            const goal = await goalService_1.goalService.update(request.params.id, request.body);
            return reply.send({ data: goal });
        }
        catch {
            return reply.status(404).send({ error: 'Meta não encontrada' });
        }
    }
    async deleteGoal(request, reply) {
        try {
            await goalService_1.goalService.delete(request.params.id);
            return reply.status(204).send();
        }
        catch {
            return reply.status(404).send({ error: 'Meta não encontrada' });
        }
    }
}
exports.GoalController = GoalController;
exports.goalController = new GoalController();
