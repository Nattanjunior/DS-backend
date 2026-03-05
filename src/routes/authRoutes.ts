import { FastifyInstance } from 'fastify'
import { register, login, me, forgotPassword, resetPassword } from '../controllers/authController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { registerUserSchema, loginUserSchema, forgotPasswordSchema, resetPasswordSchema } from '../schemas/userSchema.js'

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

  app.post(
    '/forgot-password',
    {
      schema: {
        body: forgotPasswordSchema,
      },
    },
    forgotPassword
  )

  app.post(
    '/reset-password',
    {
      schema: {
        body: resetPasswordSchema,
      },
    },
    resetPassword
  )

  app.get(
    '/me',
    {
      preHandler: [authMiddleware],
    },
    me
  )
}
