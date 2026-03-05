"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const globals_1 = require("@jest/globals");
const setup_1 = require("./setup");
(0, globals_1.describe)('Auth Integration Tests', () => {
    let app;
    (0, globals_1.beforeAll)(async () => {
        app = await (0, setup_1.buildTestApp)();
        await app.ready();
    });
    (0, globals_1.afterAll)(async () => {
        await (0, setup_1.cleanupTestData)();
        await setup_1.prisma.$disconnect();
        await app.close();
    });
    (0, globals_1.beforeEach)(async () => {
        await (0, setup_1.cleanupTestData)();
    });
    (0, globals_1.describe)('POST /auth/register', () => {
        (0, globals_1.it)('should register a new user successfully', async () => {
            const response = await (0, supertest_1.default)(app.server)
                .post('/auth/register')
                .send({
                email: 'test@example.com',
                password: 'password123',
            })
                .expect(201);
            (0, globals_1.expect)(response.body).toHaveProperty('accessToken');
            (0, globals_1.expect)(response.body.user).toHaveProperty('email', 'test@example.com');
            (0, globals_1.expect)(response.body.user).not.toHaveProperty('password');
        });
        (0, globals_1.it)('should reject duplicate email', async () => {
            await (0, supertest_1.default)(app.server)
                .post('/auth/register')
                .send({
                email: 'duplicate@example.com',
                password: 'password123',
            })
                .expect(201);
            const response = await (0, supertest_1.default)(app.server)
                .post('/auth/register')
                .send({
                email: 'duplicate@example.com',
                password: 'password123',
            })
                .expect(400);
            (0, globals_1.expect)(response.body).toHaveProperty('error');
        });
        (0, globals_1.it)('should reject invalid email format', async () => {
            const response = await (0, supertest_1.default)(app.server)
                .post('/auth/register')
                .send({
                email: 'invalid-email',
                password: 'password123',
            })
                .expect(400);
            (0, globals_1.expect)(response.body).toHaveProperty('error');
        });
        (0, globals_1.it)('should reject weak password', async () => {
            const response = await (0, supertest_1.default)(app.server)
                .post('/auth/register')
                .send({
                email: 'test2@example.com',
                password: '123',
            })
                .expect(400);
            (0, globals_1.expect)(response.body).toHaveProperty('error');
        });
    });
    (0, globals_1.describe)('POST /auth/login', () => {
        (0, globals_1.beforeEach)(async () => {
            await (0, supertest_1.default)(app.server).post('/auth/register').send({
                email: 'login@example.com',
                password: 'password123',
            });
        });
        (0, globals_1.it)('should login successfully with correct credentials', async () => {
            const response = await (0, supertest_1.default)(app.server)
                .post('/auth/login')
                .send({
                email: 'login@example.com',
                password: 'password123',
            })
                .expect(200);
            (0, globals_1.expect)(response.body).toHaveProperty('accessToken');
            (0, globals_1.expect)(response.body.user).toHaveProperty('email', 'login@example.com');
        });
        (0, globals_1.it)('should reject wrong password', async () => {
            const response = await (0, supertest_1.default)(app.server)
                .post('/auth/login')
                .send({
                email: 'login@example.com',
                password: 'wrongpassword',
            })
                .expect(401);
            (0, globals_1.expect)(response.body).toHaveProperty('error');
        });
        (0, globals_1.it)('should reject non-existent user', async () => {
            const response = await (0, supertest_1.default)(app.server)
                .post('/auth/login')
                .send({
                email: 'nonexistent@example.com',
                password: 'password123',
            })
                .expect(401);
            (0, globals_1.expect)(response.body).toHaveProperty('error');
        });
    });
    (0, globals_1.describe)('GET /auth/me', () => {
        let authToken;
        (0, globals_1.beforeEach)(async () => {
            const response = await (0, supertest_1.default)(app.server)
                .post('/auth/register')
                .send({
                email: 'me@example.com',
                password: 'password123',
            });
            authToken = response.body.accessToken;
        });
        (0, globals_1.it)('should return current user with valid token', async () => {
            const response = await (0, supertest_1.default)(app.server)
                .get('/auth/me')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);
            (0, globals_1.expect)(response.body).toHaveProperty('email', 'me@example.com');
            (0, globals_1.expect)(response.body).not.toHaveProperty('password');
        });
        (0, globals_1.it)('should reject request without token', async () => {
            const response = await (0, supertest_1.default)(app.server)
                .get('/auth/me')
                .expect(401);
            (0, globals_1.expect)(response.body).toHaveProperty('error');
        });
        (0, globals_1.it)('should reject request with invalid token', async () => {
            const response = await (0, supertest_1.default)(app.server)
                .get('/auth/me')
                .set('Authorization', 'Bearer invalid-token')
                .expect(401);
            (0, globals_1.expect)(response.body).toHaveProperty('error');
        });
    });
});
