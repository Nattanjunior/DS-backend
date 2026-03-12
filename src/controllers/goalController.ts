import { FastifyReply, FastifyRequest } from 'fastify'
import { goalService } from '../services/goalService'
import {
  CreateGoalInput,
  UpdateGoalInput,
  GoalParams,
  GoalQuery,
} from '../schemas/goalSchema'

export class GoalController {
  async getGoals(
    request: FastifyRequest<{ Querystring: GoalQuery }>,
    reply: FastifyReply
  ) {
    const goals = await goalService.findAll(request.query)
    return reply.send({ data: goals })
  }

  async getGoalById(
    request: FastifyRequest<{ Params: GoalParams }>,
    reply: FastifyReply
  ) {
    const goal = await goalService.findById(request.params.id)

    if (!goal) {
      return reply.status(404).send({ error: 'Meta não encontrada' })
    }

    return reply.send({ data: goal })
  }

  async createGoal(
    request: FastifyRequest<{ Body: CreateGoalInput }>,
    reply: FastifyReply
  ) {
    const goal = await goalService.create(request.body)
    return reply.status(201).send({ data: goal })
  }

  async updateGoal(
    request: FastifyRequest<{ Params: GoalParams; Body: UpdateGoalInput }>,
    reply: FastifyReply
  ) {
    try {
      const goal = await goalService.update(request.params.id, request.body)
      return reply.send({ data: goal })
    } catch {
      return reply.status(404).send({ error: 'Meta não encontrada' })
    }
  }

  async deleteGoal(
    request: FastifyRequest<{ Params: GoalParams }>,
    reply: FastifyReply
  ) {
    try {
      await goalService.delete(request.params.id)
      return reply.status(204).send()
    } catch {
      return reply.status(404).send({ error: 'Meta não encontrada' })
    }
  }
}

export const goalController = new GoalController()
