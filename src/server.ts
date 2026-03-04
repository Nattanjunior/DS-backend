import Fastify from 'fastify'
import cors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import { subjectRoutes } from './routes/subjectRoutes.js'
import { studyRoutes } from './routes/studyRoutes.js'
import { goalRoutes } from './routes/goalRoutes.js'
import { noteRoutes } from './routes/noteRoutes.js'
import { userRoutes } from './routes/userRoutes.js'
import { authRoutes } from './routes/authRoutes.js'

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      userId: string
      email: string
    }
    user: {
      userId: string
      email: string
    }
  }
}

const app = Fastify({
  logger: true,
})

async function start() {
  await app.register(cors, {
    origin: true,
  })

  await app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || 'dev-secret-key-change-in-production',
  })

  await app.register(authRoutes, { prefix: '/auth' })
  await app.register(subjectRoutes, { prefix: '/subjects' })
  await app.register(studyRoutes, { prefix: '/studies' })
  await app.register(goalRoutes, { prefix: '/goals' })
  await app.register(noteRoutes, { prefix: '/notes' })
  await app.register(userRoutes, { prefix: '/users' })

  const port = Number(process.env.PORT) || 3000

  app.listen({ port }, (err) => {
    if (err) {
      app.log.error(err)
      process.exit(1)
    }
  })
}

start()
