"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = userRoutes;
const userController_js_1 = require("../controllers/userController.js");
const userSchema_js_1 = require("../schemas/userSchema.js");
const authMiddleware_js_1 = require("../middleware/authMiddleware.js");
async function userRoutes(app) {
    app.addHook('preHandler', authMiddleware_js_1.authMiddleware);
    app.get('/', {
        schema: {
            querystring: userSchema_js_1.userQuerySchema,
        },
    }, userController_js_1.getUsers);
    app.get('/:id', {
        schema: {
            params: userSchema_js_1.userParamsSchema,
        },
    }, userController_js_1.getUserById);
    app.post('/', {
        schema: {
            body: userSchema_js_1.createUserSchema,
        },
    }, userController_js_1.createUser);
    app.put('/:id', {
        schema: {
            params: userSchema_js_1.userParamsSchema,
            body: userSchema_js_1.updateUserSchema,
        },
    }, userController_js_1.updateUser);
    app.delete('/:id', {
        schema: {
            params: userSchema_js_1.userParamsSchema,
        },
    }, userController_js_1.deleteUser);
}
