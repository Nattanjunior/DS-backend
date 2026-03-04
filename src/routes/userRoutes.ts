import { FastifyInstance } from 'fastify'
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from '../controllers/userController.js'
import {
  createUserSchema,
  userParamsSchema,
  userQuerySchema,
  updateUserSchema,
} from '../schemas/userSchema.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

export async function userRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authMiddleware)

  app.get(
    '/',
    {
      schema: {
        querystring: userQuerySchema,
      },
    },
    getUsers
  )

  app.get(
    '/:id',
    {
      schema: {
        params: userParamsSchema,
      },
    },
    getUserById
  )

  app.post(
    '/',
    {
      schema: {
        body: createUserSchema,
      },
    },
    createUser
  )

  app.put(
    '/:id',
    {
      schema: {
        params: userParamsSchema,
        body: updateUserSchema,
      },
    },
    updateUser
  )

  app.delete(
    '/:id',
    {
      schema: {
        params: userParamsSchema,
      },
    },
    deleteUser
  )
}
