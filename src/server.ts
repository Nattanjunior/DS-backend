import Fastify from 'fastify'
import cors from '@fastify/cors'
import { subjectRoutes } from './routes/subjectRoutes.js'
import { studyRoutes } from './routes/studyRoutes.js'
import { goalRoutes } from './routes/goalRoutes.js'
import { noteRoutes } from './routes/noteRoutes.js'

const app = Fastify({
  logger: true,
})

async function start() {
  await app.register(cors, {
    origin: true,
  })

  await app.register(subjectRoutes, { prefix: '/subjects' })
  await app.register(studyRoutes, { prefix: '/studies' })
  await app.register(goalRoutes, { prefix: '/goals' })
  await app.register(noteRoutes, { prefix: '/notes' })

  const port = Number(process.env.PORT) || 3000

  app.listen({ port }, (err) => {
    if (err) {
      app.log.error(err)
      process.exit(1)
    }
  })
}

start()
