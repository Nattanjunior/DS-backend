"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = userRoutes;
const userController_1 = require("../controllers/userController");
const userSchema_1 = require("../schemas/userSchema");
const authMiddleware_1 = require("../middleware/authMiddleware");
async function userRoutes(app) {
    app.addHook('preHandler', authMiddleware_1.authMiddleware);
    app.get('/', {
        schema: {
            querystring: userSchema_1.userQuerySchema,
        },
    }, userController_1.userController.getUsers.bind(userController_1.userController));
    app.get('/:id', {
        schema: {
            params: userSchema_1.userParamsSchema,
        },
    }, userController_1.userController.getUserById.bind(userController_1.userController));
    app.post('/', {
        schema: {
            body: userSchema_1.createUserSchema,
        },
    }, userController_1.userController.createUser.bind(userController_1.userController));
    app.put('/:id', {
        schema: {
            params: userSchema_1.userParamsSchema,
            body: userSchema_1.updateUserSchema,
        },
    }, userController_1.userController.updateUser.bind(userController_1.userController));
    app.delete('/:id', {
        schema: {
            params: userSchema_1.userParamsSchema,
        },
    }, userController_1.userController.deleteUser.bind(userController_1.userController));
}
