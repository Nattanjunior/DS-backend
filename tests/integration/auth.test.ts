import request from 'supertest'
import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals'
import { buildTestApp, cleanupTestData, prisma } from '../setup'

describe('Auth Integration Tests', () => {
  let app: Awaited<ReturnType<typeof buildTestApp>>

  beforeAll(async () => {
    app = await buildTestApp()
    await app.ready()
  })

  afterAll(async () => {
    await cleanupTestData()
    await prisma.$disconnect()
    await app.close()
  })

  beforeEach(async () => {
    await cleanupTestData()
  })

  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app.server)
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(201)

      expect(response.body).toHaveProperty('accessToken')
      expect(response.body.user).toHaveProperty('email', 'test@example.com')
      expect(response.body.user).not.toHaveProperty('password')
    })

    it('should reject duplicate email', async () => {
      await request(app.server)
        .post('/auth/register')
        .send({
          email: 'duplicate@example.com',
          password: 'password123',
        })
        .expect(201)

      const response = await request(app.server)
        .post('/auth/register')
        .send({
          email: 'duplicate@example.com',
          password: 'password123',
        })
        .expect(400)

      expect(response.body).toHaveProperty('error')
    })

    it('should reject invalid email format', async () => {
      const response = await request(app.server)
        .post('/auth/register')
        .send({
          email: 'invalid-email',
          password: 'password123',
        })
        .expect(400)

      expect(response.body).toHaveProperty('error')
    })

    it('should reject weak password', async () => {
      const response = await request(app.server)
        .post('/auth/register')
        .send({
          email: 'test2@example.com',
          password: '123',
        })
        .expect(400)

      expect(response.body).toHaveProperty('error')
    })
  })

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      await request(app.server).post('/auth/register').send({
        email: 'login@example.com',
        password: 'password123',
      })
    })

    it('should login successfully with correct credentials', async () => {
      const response = await request(app.server)
        .post('/auth/login')
        .send({
          email: 'login@example.com',
          password: 'password123',
        })
        .expect(200)

      expect(response.body).toHaveProperty('accessToken')
      expect(response.body.user).toHaveProperty('email', 'login@example.com')
    })

    it('should reject wrong password', async () => {
      const response = await request(app.server)
        .post('/auth/login')
        .send({
          email: 'login@example.com',
          password: 'wrongpassword',
        })
        .expect(401)

      expect(response.body).toHaveProperty('error')
    })

    it('should reject non-existent user', async () => {
      const response = await request(app.server)
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        })
        .expect(401)

      expect(response.body).toHaveProperty('error')
    })
  })

  describe('GET /auth/me', () => {
    let authToken: string

    beforeEach(async () => {
      const response = await request(app.server)
        .post('/auth/register')
        .send({
          email: 'me@example.com',
          password: 'password123',
        })
      authToken = response.body.accessToken
    })

    it('should return current user with valid token', async () => {
      const response = await request(app.server)
        .get('/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      expect(response.body).toHaveProperty('email', 'me@example.com')
      expect(response.body).not.toHaveProperty('password')
    })

    it('should reject request without token', async () => {
      const response = await request(app.server)
        .get('/auth/me')
        .expect(401)

      expect(response.body).toHaveProperty('error')
    })

    it('should reject request with invalid token', async () => {
      const response = await request(app.server)
        .get('/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401)

      expect(response.body).toHaveProperty('error')
    })
  })
})
