import { FastifyReply, FastifyRequest } from 'fastify'
import { subjectService } from '../services/subjectService'
import {
  CreateSubjectInput,
  UpdateSubjectInput,
  SubjectParams,
  SubjectQuery,
} from '../schemas/subjectSchema'

export class SubjectController {
  async getSubjects(
    request: FastifyRequest<{ Querystring: SubjectQuery }>,
    reply: FastifyReply
  ) {
    const userId = request.user?.userId
    const subjects = await subjectService.findAll()
    return reply.send({ data: subjects })
  }

  async getSubjectById(
    request: FastifyRequest<{ Params: SubjectParams }>,
    reply: FastifyReply
  ) {
    const subject = await subjectService.findById(request.params.id)

    if (!subject) {
      return reply.status(404).send({ error: 'Matéria não encontrada' })
    }

    return reply.send({ data: subject })
  }

  async createSubject(
    request: FastifyRequest<{ Body: CreateSubjectInput }>,
    reply: FastifyReply
  ) {
    const userId = request.user?.userId
    const subject = await subjectService.create(request.body, userId)
    return reply.status(201).send({ data: subject })
  }

  async updateSubject(
    request: FastifyRequest<{ Params: SubjectParams; Body: UpdateSubjectInput }>,
    reply: FastifyReply
  ) {
    try {
      const subject = await subjectService.update(request.params.id, request.body)
      return reply.send({ data: subject })
    } catch {
      return reply.status(404).send({ error: 'Matéria não encontrada' })
    }
  }

  async deleteSubject(
    request: FastifyRequest<{ Params: SubjectParams }>,
    reply: FastifyReply
  ) {
    try {
      await subjectService.delete(request.params.id)
      return reply.status(204).send()
    } catch {
      return reply.status(404).send({ error: 'Matéria não encontrada' })
    }
  }
}

export const subjectController = new SubjectController()
