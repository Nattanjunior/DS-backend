import { FastifyInstance } from 'fastify'
import {
  createGoal,
  deleteGoal,
  getGoalById,
  getGoals,
  updateGoal,
} from '../controllers/goalController.js'
import {
  createGoalSchema,
  goalParamsSchema,
  goalQuerySchema,
  updateGoalSchema,
} from '../schemas/goalSchema.js'

export async function goalRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      schema: {
        querystring: goalQuerySchema,
      },
    },
    getGoals
  )

  app.get(
    '/:id',
    {
      schema: {
        params: goalParamsSchema,
      },
    },
    getGoalById
  )

  app.post(
    '/',
    {
      schema: {
        body: createGoalSchema,
      },
    },
    createGoal
  )

  app.put(
    '/:id',
    {
      schema: {
        params: goalParamsSchema,
        body: updateGoalSchema,
      },
    },
    updateGoal
  )

  app.delete(
    '/:id',
    {
      schema: {
        params: goalParamsSchema,
      },
    },
    deleteGoal
  )
}
