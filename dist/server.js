"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const subjectRoutes_js_1 = require("./routes/subjectRoutes.js");
const studyRoutes_js_1 = require("./routes/studyRoutes.js");
const goalRoutes_js_1 = require("./routes/goalRoutes.js");
const noteRoutes_js_1 = require("./routes/noteRoutes.js");
const userRoutes_js_1 = require("./routes/userRoutes.js");
const authRoutes_js_1 = require("./routes/authRoutes.js");
const app = (0, fastify_1.default)({
    logger: true,
});
async function start() {
    await app.register(cors_1.default, {
        origin: true,
    });
    await app.register(jwt_1.default, {
        secret: process.env.JWT_SECRET || 'dev-secret-key-change-in-production',
    });
    await app.register(authRoutes_js_1.authRoutes, { prefix: '/auth' });
    await app.register(subjectRoutes_js_1.subjectRoutes, { prefix: '/subjects' });
    await app.register(studyRoutes_js_1.studyRoutes, { prefix: '/studies' });
    await app.register(goalRoutes_js_1.goalRoutes, { prefix: '/goals' });
    await app.register(noteRoutes_js_1.noteRoutes, { prefix: '/notes' });
    await app.register(userRoutes_js_1.userRoutes, { prefix: '/users' });
    const port = Number(process.env.PORT) || 3000;
    app.listen({ port }, (err) => {
        if (err) {
            app.log.error(err);
            process.exit(1);
        }
    });
}
start();
