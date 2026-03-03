"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const subjectRoutes_js_1 = require("./routes/subjectRoutes.js");
const studyRoutes_js_1 = require("./routes/studyRoutes.js");
const goalRoutes_js_1 = require("./routes/goalRoutes.js");
const noteRoutes_js_1 = require("./routes/noteRoutes.js");
const app = (0, fastify_1.default)({
    logger: true,
});
async function start() {
    await app.register(cors_1.default, {
        origin: true,
    });
    await app.register(subjectRoutes_js_1.subjectRoutes, { prefix: '/subjects' });
    await app.register(studyRoutes_js_1.studyRoutes, { prefix: '/studies' });
    await app.register(goalRoutes_js_1.goalRoutes, { prefix: '/goals' });
    await app.register(noteRoutes_js_1.noteRoutes, { prefix: '/notes' });
    const port = Number(process.env.PORT) || 3000;
    app.listen({ port }, (err) => {
        if (err) {
            app.log.error(err);
            process.exit(1);
        }
    });
}
start();
