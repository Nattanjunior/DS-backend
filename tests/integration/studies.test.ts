import request from 'supertest'
import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals'
import { buildTestApp, cleanupTestData, prisma } from '../setup'

describe('Studies Integration Tests', () => {
  let app: Awaited<ReturnType<typeof buildTestApp>>
  let authToken: string
  let userId: string

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
        email: 'studies@example.com',
        password: 'password123',
      })
    
    authToken = registerResponse.body.accessToken
    
    const meResponse = await request(app.server)
      .get('/auth/me')
      .set('Authorization', `Bearer ${authToken}`)
    
    userId = meResponse.body.id
  })

  describe('POST /studies', () => {
    it('should create a new study session', async () => {
      const response = await request(app.server)
        .post('/studies')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          hours: 2.5,
          date: '2024-01-15T10:00:00Z',
        })
        .expect(201)

      expect(response.body).toHaveProperty('id')
      expect(response.body.hours).toBe(2.5)
    })

    it('should reject invalid hours', async () => {
      const response = await request(app.server)
        .post('/studies')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          hours: -1,
          date: '2024-01-15T10:00:00Z',
        })
        .expect(400)

      expect(response.body).toHaveProperty('error')
    })

    it('should require authentication', async () => {
      const response = await request(app.server)
        .post('/studies')
        .send({
          hours: 2.5,
          date: '2024-01-15T10:00:00Z',
        })
        .expect(401)

      expect(response.body).toHaveProperty('error')
    })
  })

  describe('GET /studies', () => {
    beforeEach(async () => {
      await request(app.server)
        .post('/studies')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ hours: 1, date: '2024-01-10T10:00:00Z' })
      
      await request(app.server)
        .post('/studies')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ hours: 2, date: '2024-01-15T10:00:00Z' })
    })

    it('should list all studies for authenticated user', async () => {
      const response = await request(app.server)
        .get('/studies')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      expect(response.body).toHaveLength(2)
    })

    it('should filter by date range', async () => {
      const response = await request(app.server)
        .get('/studies?startDate=2024-01-12&endDate=2024-01-20')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      expect(response.body).toHaveLength(1)
      expect(response.body[0].hours).toBe(2)
    })
  })

  describe('GET /studies/:id', () => {
    let studyId: string

    beforeEach(async () => {
      const response = await request(app.server)
        .post('/studies')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ hours: 3, date: '2024-01-20T10:00:00Z' })
      
      studyId = response.body.id
    })

    it('should get a specific study', async () => {
      const response = await request(app.server)
        .get(`/studies/${studyId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      expect(response.body.id).toBe(studyId)
      expect(response.body.hours).toBe(3)
    })

    it('should return 404 for non-existent study', async () => {
      const response = await request(app.server)
        .get('/studies/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404)

      expect(response.body).toHaveProperty('error')
    })
  })

  describe('PUT /studies/:id', () => {
    let studyId: string

    beforeEach(async () => {
      const response = await request(app.server)
        .post('/studies')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ hours: 1, date: '2024-01-20T10:00:00Z' })
      
      studyId = response.body.id
    })

    it('should update a study', async () => {
      const response = await request(app.server)
        .put(`/studies/${studyId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ hours: 5 })
        .expect(200)

      expect(response.body.hours).toBe(5)
    })
  })

  describe('DELETE /studies/:id', () => {
    let studyId: string

    beforeEach(async () => {
      const response = await request(app.server)
        .post('/studies')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ hours: 1, date: '2024-01-20T10:00:00Z' })
      
      studyId = response.body.id
    })

    it('should delete a study', async () => {
      await request(app.server)
        .delete(`/studies/${studyId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204)

      const response = await request(app.server)
        .get(`/studies/${studyId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404)

      expect(response.body).toHaveProperty('error')
    })
  })
})
