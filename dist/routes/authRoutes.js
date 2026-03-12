"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = authRoutes;
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
async function authRoutes(app) {
    app.post('/register', {
        schema: {
            body: { type: "object",
                required: ["email", "password"],
                properties: { name: { type: "string" },
                    email: { type: "string", format: "email" },
                    password: { type: "string", minLength: 6 }
                }
            }
        }
    }, authController_1.authController.register.bind(authController_1.authController));
    app.post('/login', {
        schema: {
            body: { type: "object",
                required: ["email", "password"],
                properties: {
                    email: { type: "string", format: "email" },
                    password: { type: "string", minLength: 6 }
                }
            }
        }
    }, authController_1.authController.login.bind(authController_1.authController));
    app.post('/forgot-password', {
        schema: {
            body: { type: "object",
                required: ["email"],
                properties: { email: { type: "string", format: "email" } }
            }
        }
    }, authController_1.authController.forgotPassword.bind(authController_1.authController));
    app.post('/reset-password', {
        schema: {
            body: { type: "object",
                required: ["password"],
                properties: { password: { type: "string", minLength: 6 } }
            }
        }
    }, authController_1.authController.resetPassword.bind(authController_1.authController));
    app.get('/me', {
        preHandler: [authMiddleware_1.authMiddleware],
    }, authController_1.authController.me.bind(authController_1.authController));
}
