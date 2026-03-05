"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const globals_1 = require("@jest/globals");
const setup_1 = require("./setup");
(0, globals_1.describe)('Studies Integration Tests', () => {
    let app;
    let authToken;
    let userId;
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
        const registerResponse = await (0, supertest_1.default)(app.server)
            .post('/auth/register')
            .send({
            email: 'studies@example.com',
            password: 'password123',
        });
        authToken = registerResponse.body.accessToken;
        const meResponse = await (0, supertest_1.default)(app.server)
            .get('/auth/me')
            .set('Authorization', `Bearer ${authToken}`);
        userId = meResponse.body.id;
    });
    (0, globals_1.describe)('POST /studies', () => {
        (0, globals_1.it)('should create a new study session', async () => {
            const response = await (0, supertest_1.default)(app.server)
                .post('/studies')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                hours: 2.5,
                date: '2024-01-15T10:00:00Z',
            })
                .expect(201);
            (0, globals_1.expect)(response.body).toHaveProperty('id');
            (0, globals_1.expect)(response.body.hours).toBe(2.5);
        });
        (0, globals_1.it)('should reject invalid hours', async () => {
            const response = await (0, supertest_1.default)(app.server)
                .post('/studies')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                hours: -1,
                date: '2024-01-15T10:00:00Z',
            })
                .expect(400);
            (0, globals_1.expect)(response.body).toHaveProperty('error');
        });
        (0, globals_1.it)('should require authentication', async () => {
            const response = await (0, supertest_1.default)(app.server)
                .post('/studies')
                .send({
                hours: 2.5,
                date: '2024-01-15T10:00:00Z',
            })
                .expect(401);
            (0, globals_1.expect)(response.body).toHaveProperty('error');
        });
    });
    (0, globals_1.describe)('GET /studies', () => {
        (0, globals_1.beforeEach)(async () => {
            await (0, supertest_1.default)(app.server)
                .post('/studies')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ hours: 1, date: '2024-01-10T10:00:00Z' });
            await (0, supertest_1.default)(app.server)
                .post('/studies')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ hours: 2, date: '2024-01-15T10:00:00Z' });
        });
        (0, globals_1.it)('should list all studies for authenticated user', async () => {
            const response = await (0, supertest_1.default)(app.server)
                .get('/studies')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);
            (0, globals_1.expect)(response.body).toHaveLength(2);
        });
        (0, globals_1.it)('should filter by date range', async () => {
            const response = await (0, supertest_1.default)(app.server)
                .get('/studies?startDate=2024-01-12&endDate=2024-01-20')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);
            (0, globals_1.expect)(response.body).toHaveLength(1);
            (0, globals_1.expect)(response.body[0].hours).toBe(2);
        });
    });
    (0, globals_1.describe)('GET /studies/:id', () => {
        let studyId;
        (0, globals_1.beforeEach)(async () => {
            const response = await (0, supertest_1.default)(app.server)
                .post('/studies')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ hours: 3, date: '2024-01-20T10:00:00Z' });
            studyId = response.body.id;
        });
        (0, globals_1.it)('should get a specific study', async () => {
            const response = await (0, supertest_1.default)(app.server)
                .get(`/studies/${studyId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);
            (0, globals_1.expect)(response.body.id).toBe(studyId);
            (0, globals_1.expect)(response.body.hours).toBe(3);
        });
        (0, globals_1.it)('should return 404 for non-existent study', async () => {
            const response = await (0, supertest_1.default)(app.server)
                .get('/studies/non-existent-id')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(404);
            (0, globals_1.expect)(response.body).toHaveProperty('error');
        });
    });
    (0, globals_1.describe)('PUT /studies/:id', () => {
        let studyId;
        (0, globals_1.beforeEach)(async () => {
            const response = await (0, supertest_1.default)(app.server)
                .post('/studies')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ hours: 1, date: '2024-01-20T10:00:00Z' });
            studyId = response.body.id;
        });
        (0, globals_1.it)('should update a study', async () => {
            const response = await (0, supertest_1.default)(app.server)
                .put(`/studies/${studyId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ hours: 5 })
                .expect(200);
            (0, globals_1.expect)(response.body.hours).toBe(5);
        });
    });
    (0, globals_1.describe)('DELETE /studies/:id', () => {
        let studyId;
        (0, globals_1.beforeEach)(async () => {
            const response = await (0, supertest_1.default)(app.server)
                .post('/studies')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ hours: 1, date: '2024-01-20T10:00:00Z' });
            studyId = response.body.id;
        });
        (0, globals_1.it)('should delete a study', async () => {
            await (0, supertest_1.default)(app.server)
                .delete(`/studies/${studyId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(204);
            const response = await (0, supertest_1.default)(app.server)
                .get(`/studies/${studyId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(404);
            (0, globals_1.expect)(response.body).toHaveProperty('error');
        });
    });
});
