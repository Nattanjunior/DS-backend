"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.goalRoutes = goalRoutes;
const goalController_1 = require("../controllers/goalController");
const goalSchema_1 = require("../schemas/goalSchema");
const authMiddleware_1 = require("../middleware/authMiddleware");
async function goalRoutes(app) {
    app.addHook('preHandler', authMiddleware_1.authMiddleware);
    app.get('/', {
        schema: {
            querystring: goalSchema_1.goalQuerySchema,
        },
    }, goalController_1.goalController.getGoals.bind(goalController_1.goalController));
    app.get('/:id', {
        schema: {
            params: goalSchema_1.goalParamsSchema,
        },
    }, goalController_1.goalController.getGoalById.bind(goalController_1.goalController));
    app.post('/', {
        schema: {
            body: goalSchema_1.createGoalSchema,
        },
    }, goalController_1.goalController.createGoal.bind(goalController_1.goalController));
    app.put('/:id', {
        schema: {
            params: goalSchema_1.goalParamsSchema,
            body: goalSchema_1.updateGoalSchema,
        },
    }, goalController_1.goalController.updateGoal.bind(goalController_1.goalController));
    app.delete('/:id', {
        schema: {
            params: goalSchema_1.goalParamsSchema,
        },
    }, goalController_1.goalController.deleteGoal.bind(goalController_1.goalController));
}
