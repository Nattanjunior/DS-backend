import Fastify from 'fastify'
import cors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import rateLimit from '@fastify/rate-limit'
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

const isDevelopment = process.env.NODE_ENV !== 'production'

const app = Fastify({
  logger: isDevelopment
    ? {
        level: 'debug',
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname',
          },
        },
      }
    : {
        level: 'info',
        formatters: {
          level: (label) => ({ level: label }),
        },
      },
})

async function start() {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required')
  }

  if (process.env.JWT_SECRET === 'CHANGE_ME_IN_PRODUCTION_USE_OPENSSL_RAND_HEX_32') {
    app.log.warn('WARNING: Using default JWT_SECRET. Change this in production!')
  }

  await app.register(rateLimit, {
    keyGenerator: (request) => {
    return request.user?.userId || request.ip
  },
    max: 100,
    timeWindow: '10 minute',
    errorResponseBuilder: (request, context) => ({
      error: 'Too Many Requests',
      message: `Rate limit exceeded. Try again in ${context.after}`,
      statusCode: 429,
    }),
  })

  await app.register(cors, {
    origin: true,
  })

  await app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET,
  })

  await app.register(authRoutes, { prefix: '/auth' })
  await app.register(subjectRoutes, { prefix: '/subjects' })
  await app.register(studyRoutes, { prefix: '/studies' })
  await app.register(goalRoutes, { prefix: '/goals' })
  await app.register(noteRoutes, { prefix: '/notes' })
  await app.register(userRoutes, { prefix: '/users' })

  app.get('/health', async (request, reply) => {
    const healthcheck = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    }
    return reply.send(healthcheck)
  })

  const port = Number(process.env.PORT) || 3000

  app.listen({ port }, (err) => {
    if (err) {
      app.log.error(err)
      process.exit(1)
    }
  })
}

start()
