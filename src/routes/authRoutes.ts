import { FastifyInstance } from 'fastify'
import { authController } from '../controllers/authController'
import { authMiddleware } from '../middleware/authMiddleware'

export async function authRoutes(app: FastifyInstance) {
  app.post(
    '/register',
    {
      schema: { 
        body: 
        { type: "object", 
          required: ["email", "password"], 
          properties: { name: { type: "string" }, 
          email: { type: "string", format: "email" }, 
          password: { type: "string", minLength: 6 } 
        } 
      } 
    }
    },
    authController.register.bind(authController)
  )

  app.post(
    '/login',
    {
      schema: { 
        body: 
        { type: "object", 
          required: ["email", "password"], 
          properties: { 
            email: { type: "string", format: "email" }, 
            password: { type: "string", minLength: 6 } 
        } 
      } 
    }
    },
    authController.login.bind(authController)
  )

  app.post(
    '/forgot-password',
    {
      schema: { 
        body: 
        { type: "object", 
          required: ["email"], 
          properties: { email: { type: "string", format: "email" }} 
      } 
    }
    },
    authController.forgotPassword.bind(authController)
  )

  app.post(
    '/reset-password',
    {
      schema: { 
        body: 
        { type: "object", 
          required: ["password"], 
          properties: { password: { type: "string", minLength: 6 }} 
       } 
    }
    },
    authController.resetPassword.bind(authController)
  )

  app.get(
    '/me',
    {
      preHandler: [authMiddleware],
    },
    authController.me.bind(authController)
  )
}
