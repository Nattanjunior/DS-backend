import { FastifyInstance } from 'fastify'
import { goalController } from '../controllers/goalController'
import {
  createGoalSchema,
  goalParamsSchema,
  goalQuerySchema,
  updateGoalSchema,
} from '../schemas/goalSchema'
import { authMiddleware } from '../middleware/authMiddleware'

export async function goalRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authMiddleware)

  app.get(
    '/',
    {
      schema: {
        querystring: goalQuerySchema,
      },
    },
    goalController.getGoals.bind(goalController)
  )

  app.get(
    '/:id',
    {
      schema: {
        params: goalParamsSchema,
      },
    },
    goalController.getGoalById.bind(goalController)
  )

  app.post(
    '/',
    {
      schema: {
        body: createGoalSchema,
      },
    },
    goalController.createGoal.bind(goalController)
  )

  app.put(
    '/:id',
    {
      schema: {
        params: goalParamsSchema,
        body: updateGoalSchema,
      },
    },
    goalController.updateGoal.bind(goalController)
  )

  app.delete(
    '/:id',
    {
      schema: {
        params: goalParamsSchema,
      },
    },
    goalController.deleteGoal.bind(goalController)
  )
}
