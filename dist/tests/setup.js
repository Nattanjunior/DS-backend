"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
exports.buildTestApp = buildTestApp;
exports.cleanupTestData = cleanupTestData;
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const rate_limit_1 = __importDefault(require("@fastify/rate-limit"));
const authRoutes_js_1 = require("../src/routes/authRoutes.js");
const subjectRoutes_js_1 = require("../src/routes/subjectRoutes.js");
const studyRoutes_js_1 = require("../src/routes/studyRoutes.js");
const goalRoutes_js_1 = require("../src/routes/goalRoutes.js");
const noteRoutes_js_1 = require("../src/routes/noteRoutes.js");
const userRoutes_js_1 = require("../src/routes/userRoutes.js");
const client_1 = require("@prisma/client");
exports.prisma = new client_1.PrismaClient({
    datasources: {
        db: {
            url: process.env.TEST_DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/DS-db-test',
        },
    },
});
async function buildTestApp() {
    const app = (0, fastify_1.default)({ logger: false });
    const testJwtSecret = 'test-jwt-secret-for-integration-tests';
    await app.register(rate_limit_1.default, { max: 1000, timeWindow: '1 minute' });
    await app.register(cors_1.default, { origin: true });
    await app.register(jwt_1.default, { secret: testJwtSecret });
    await app.register(authRoutes_js_1.authRoutes, { prefix: '/auth' });
    await app.register(subjectRoutes_js_1.subjectRoutes, { prefix: '/subjects' });
    await app.register(studyRoutes_js_1.studyRoutes, { prefix: '/studies' });
    await app.register(goalRoutes_js_1.goalRoutes, { prefix: '/goals' });
    await app.register(noteRoutes_js_1.noteRoutes, { prefix: '/notes' });
    await app.register(userRoutes_js_1.userRoutes, { prefix: '/users' });
    app.decorate('testJwtSecret', testJwtSecret);
    return app;
}
async function cleanupTestData() {
    await exports.prisma.goalDaySubject.deleteMany({});
    await exports.prisma.goalDay.deleteMany({});
    await exports.prisma.goal.deleteMany({});
    await exports.prisma.note.deleteMany({});
    await exports.prisma.study.deleteMany({});
    await exports.prisma.subject.deleteMany({});
    await exports.prisma.user.deleteMany({});
}
