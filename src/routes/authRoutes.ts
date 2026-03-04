import { FastifyInstance } from 'fastify'
import { register, login, me } from '../controllers/authController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { registerUserSchema, loginUserSchema } from '../schemas/userSchema.js'

export async function authRoutes(app: FastifyInstance) {
  app.post(
    '/register',
    {
      schema: {
        body: registerUserSchema,
      },
    },
    register
  )

  app.post(
    '/login',
    {
      schema: {
        body: loginUserSchema,
      },
    },
    login
  )

  app.get(
    '/me',
    {
      preHandler: [authMiddleware],
    },
    me
  )
}
