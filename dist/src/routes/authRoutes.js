"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = authRoutes;
const authController_js_1 = require("../controllers/authController.js");
const authMiddleware_js_1 = require("../middleware/authMiddleware.js");
const userSchema_js_1 = require("../schemas/userSchema.js");
async function authRoutes(app) {
    app.post('/register', {
        schema: {
            body: userSchema_js_1.registerUserSchema,
        },
    }, authController_js_1.register);
    app.post('/login', {
        schema: {
            body: userSchema_js_1.loginUserSchema,
        },
    }, authController_js_1.login);
    app.get('/me', {
        preHandler: [authMiddleware_js_1.authMiddleware],
    }, authController_js_1.me);
}
