import { FastifyReply, FastifyRequest } from 'fastify'
import { studyService } from '../services/studyService'
import {
  CreateStudyInput,
  UpdateStudyInput,
  StudyParams,
  StudyQuery,
} from '../schemas/studySchema'

export class StudyController {
  async getStudies(
    request: FastifyRequest<{ Querystring: StudyQuery }>,
    reply: FastifyReply
  ) {
    const studies = await studyService.findAll(request.query)
    return reply.send({ data: studies })
  }

  async getStudyById(
    request: FastifyRequest<{ Params: StudyParams }>,
    reply: FastifyReply
  ) {
    const study = await studyService.findById(request.params.id)

    if (!study) {
      return reply.status(404).send({ error: 'Estudo não encontrado' })
    }

    return reply.send({ data: study })
  }

  async createStudy(
    request: FastifyRequest<{ Body: CreateStudyInput }>,
    reply: FastifyReply
  ) {
    const study = await studyService.create(request.body)
    return reply.status(201).send({ data: study })
  }

  async updateStudy(
    request: FastifyRequest<{ Params: StudyParams; Body: UpdateStudyInput }>,
    reply: FastifyReply
  ) {
    try {
      const study = await studyService.update(request.params.id, request.body)
      return reply.send({ data: study })
    } catch {
      return reply.status(404).send({ error: 'Estudo não encontrado' })
    }
  }

  async deleteStudy(
    request: FastifyRequest<{ Params: StudyParams }>,
    reply: FastifyReply
  ) {
    try {
      await studyService.delete(request.params.id)
      return reply.status(204).send()
    } catch {
      return reply.status(404).send({ error: 'Estudo não encontrado' })
    }
  }
}

export const studyController = new StudyController()
