import { FastifyInstance } from 'fastify'
import fastify from 'fastify'
import cors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import rateLimit from '@fastify/rate-limit'
import { validatorCompiler, serializerCompiler } from 'fastify-type-provider-zod'
import { authRoutes } from '../src/routes/authRoutes'
import { subjectRoutes } from '../src/routes/subjectRoutes'
import { studyRoutes } from '../src/routes/studyRoutes'
import { goalRoutes } from '../src/routes/goalRoutes'
import { noteRoutes } from '../src/routes/noteRoutes'
import { userRoutes } from '../src/routes/userRoutes'
import { PrismaClient } from '@prisma/client'

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { userId: string; email: string }
    user: { userId: string; email: string }
  }
}

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/DS-db-test',
    },
  },
})

export async function buildTestApp(): Promise<FastifyInstance> {
  const app = fastify({ logger: false })

  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  const testJwtSecret = 'test-jwt-secret-for-integration-tests'

  await app.register(rateLimit, { max: 1000, timeWindow: '1 minute' })
  await app.register(cors, { origin: true })
  await app.register(fastifyJwt, { secret: testJwtSecret })

  await app.register(authRoutes, { prefix: '/auth' })
  await app.register(subjectRoutes, { prefix: '/subjects' })
  await app.register(studyRoutes, { prefix: '/studies' })
  await app.register(goalRoutes, { prefix: '/goals' })
  await app.register(noteRoutes, { prefix: '/notes' })
  await app.register(userRoutes, { prefix: '/users' })

  app.decorate('testJwtSecret', testJwtSecret)

  return app
}

export async function cleanupTestData() {
  await prisma.goalDaySubject.deleteMany({})
  await prisma.goalDay.deleteMany({})
  await prisma.goal.deleteMany({})
  await prisma.note.deleteMany({})
  await prisma.study.deleteMany({})
  await prisma.subject.deleteMany({})
  await prisma.user.deleteMany({})
}
