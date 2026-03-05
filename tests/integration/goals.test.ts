import request from 'supertest'
import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals'
import { buildTestApp, cleanupTestData, prisma } from '../setup'

describe('Goals Integration Tests', () => {
  let app: Awaited<ReturnType<typeof buildTestApp>>
  let authToken: string

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
    
    const registerResponse = await request(app.server)
      .post('/auth/register')
      .send({
        email: 'goals@example.com',
        password: 'password123',
      })
    
    authToken = registerResponse.body.accessToken
  })

  describe('POST /goals', () => {
    it('should create a weekly goal', async () => {
      const response = await request(app.server)
        .post('/goals')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          type: 'WEEKLY',
          totalHours: 20,
          startDate: '2024-01-15T00:00:00Z',
          endDate: '2024-01-21T23:59:59Z',
        })
        .expect(201)

      expect(response.body).toHaveProperty('id')
      expect(response.body.type).toBe('WEEKLY')
      expect(response.body.totalHours).toBe(20)
    })

    it('should create a monthly goal', async () => {
      const response = await request(app.server)
        .post('/goals')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          type: 'MONTHLY',
          totalHours: 100,
          startDate: '2024-01-01T00:00:00Z',
          endDate: '2024-01-31T23:59:59Z',
        })
        .expect(201)

      expect(response.body.type).toBe('MONTHLY')
      expect(response.body.totalHours).toBe(100)
    })

    it('should reject invalid goal type', async () => {
      const response = await request(app.server)
        .post('/goals')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          type: 'INVALID',
          totalHours: 20,
          startDate: '2024-01-15T00:00:00Z',
          endDate: '2024-01-21T23:59:59Z',
        })
        .expect(400)

      expect(response.body).toHaveProperty('error')
    })

    it('should require authentication', async () => {
      const response = await request(app.server)
        .post('/goals')
        .send({
          type: 'WEEKLY',
          totalHours: 20,
          startDate: '2024-01-15T00:00:00Z',
          endDate: '2024-01-21T23:59:59Z',
        })
        .expect(401)

      expect(response.body).toHaveProperty('error')
    })
  })

  describe('GET /goals', () => {
    beforeEach(async () => {
      await request(app.server)
        .post('/goals')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          type: 'WEEKLY',
          totalHours: 20,
          startDate: '2024-01-15T00:00:00Z',
          endDate: '2024-01-21T23:59:59Z',
        })
      
      await request(app.server)
        .post('/goals')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          type: 'MONTHLY',
          totalHours: 100,
          startDate: '2024-01-01T00:00:00Z',
          endDate: '2024-01-31T23:59:59Z',
        })
    })

    it('should list all goals for authenticated user', async () => {
      const response = await request(app.server)
        .get('/goals')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      expect(response.body).toHaveLength(2)
    })

    it('should filter by goal type', async () => {
      const response = await request(app.server)
        .get('/goals?type=WEEKLY')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      expect(response.body).toHaveLength(1)
      expect(response.body[0].type).toBe('WEEKLY')
    })
  })

  describe('GET /goals/:id', () => {
    let goalId: string

    beforeEach(async () => {
      const response = await request(app.server)
        .post('/goals')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          type: 'WEEKLY',
          totalHours: 25,
          startDate: '2024-02-01T00:00:00Z',
          endDate: '2024-02-07T23:59:59Z',
        })
      
      goalId = response.body.id
    })

    it('should get a specific goal', async () => {
      const response = await request(app.server)
        .get(`/goals/${goalId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      expect(response.body.id).toBe(goalId)
      expect(response.body.totalHours).toBe(25)
    })

    it('should return 404 for non-existent goal', async () => {
      const response = await request(app.server)
        .get('/goals/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404)

      expect(response.body).toHaveProperty('error')
    })
  })

  describe('PUT /goals/:id', () => {
    let goalId: string

    beforeEach(async () => {
      const response = await request(app.server)
        .post('/goals')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          type: 'WEEKLY',
          totalHours: 20,
          startDate: '2024-02-01T00:00:00Z',
          endDate: '2024-02-07T23:59:59Z',
        })
      
      goalId = response.body.id
    })

    it('should update a goal', async () => {
      const response = await request(app.server)
        .put(`/goals/${goalId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ totalHours: 30 })
        .expect(200)

      expect(response.body.totalHours).toBe(30)
    })
  })

  describe('DELETE /goals/:id', () => {
    let goalId: string

    beforeEach(async () => {
      const response = await request(app.server)
        .post('/goals')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          type: 'WEEKLY',
          totalHours: 20,
          startDate: '2024-02-01T00:00:00Z',
          endDate: '2024-02-07T23:59:59Z',
        })
      
      goalId = response.body.id
    })

    it('should delete a goal', async () => {
      await request(app.server)
        .delete(`/goals/${goalId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204)

      const response = await request(app.server)
        .get(`/goals/${goalId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404)

      expect(response.body).toHaveProperty('error')
    })
  })
})
