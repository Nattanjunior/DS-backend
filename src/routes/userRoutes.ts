import { FastifyInstance } from 'fastify'
import { userController } from '../controllers/userController'
import {
  createUserSchema,
  userParamsSchema,
  userQuerySchema,
  updateUserSchema,
} from '../schemas/userSchema'
import { authMiddleware } from '../middleware/authMiddleware'

export async function userRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authMiddleware)

  app.get(
    '/',
    {
      schema: {
        querystring: userQuerySchema,
      },
    },
    userController.getUsers.bind(userController)
  )

  app.get(
    '/:id',
    {
      schema: {
        params: userParamsSchema,
      },
    },
    userController.getUserById.bind(userController)
  )

  app.post(
    '/',
    {
      schema: {
        body: createUserSchema,
      },
    },
    userController.createUser.bind(userController)
  )

  app.put(
    '/:id',
    {
      schema: {
        params: userParamsSchema,
        body: updateUserSchema,
      },
    },
    userController.updateUser.bind(userController)
  )

  app.delete(
    '/:id',
    {
      schema: {
        params: userParamsSchema,
      },
    },
    userController.deleteUser.bind(userController)
  )
}
