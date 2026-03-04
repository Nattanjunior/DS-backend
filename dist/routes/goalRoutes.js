"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.goalRoutes = goalRoutes;
const goalController_js_1 = require("../controllers/goalController.js");
const goalSchema_js_1 = require("../schemas/goalSchema.js");
const authMiddleware_js_1 = require("../middleware/authMiddleware.js");
async function goalRoutes(app) {
    app.addHook('preHandler', authMiddleware_js_1.authMiddleware);
    app.get('/', {
        schema: {
            querystring: goalSchema_js_1.goalQuerySchema,
        },
    }, goalController_js_1.getGoals);
    app.get('/:id', {
        schema: {
            params: goalSchema_js_1.goalParamsSchema,
        },
    }, goalController_js_1.getGoalById);
    app.post('/', {
        schema: {
            body: goalSchema_js_1.createGoalSchema,
        },
    }, goalController_js_1.createGoal);
    app.put('/:id', {
        schema: {
            params: goalSchema_js_1.goalParamsSchema,
            body: goalSchema_js_1.updateGoalSchema,
        },
    }, goalController_js_1.updateGoal);
    app.delete('/:id', {
        schema: {
            params: goalSchema_js_1.goalParamsSchema,
        },
    }, goalController_js_1.deleteGoal);
}
