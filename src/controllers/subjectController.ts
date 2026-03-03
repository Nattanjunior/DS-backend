import { FastifyReply, FastifyRequest } from 'fastify'
import { subjectService } from '../services/subjectService.js'
import {
  CreateSubjectInput,
  UpdateSubjectInput,
  SubjectParams,
  SubjectQuery,
} from '../schemas/subjectSchema.js'

export async function getSubjects(
  request: FastifyRequest<{ Querystring: SubjectQuery }>,
  reply: FastifyReply
) {
  const subjects = await subjectService.findAll(request.query)
  return reply.send({ data: subjects })
}

export async function getSubjectById(
  request: FastifyRequest<{ Params: SubjectParams }>,
  reply: FastifyReply
) {
  const subject = await subjectService.findById(request.params.id)

  if (!subject) {
    return reply.status(404).send({ error: 'Matéria não encontrada' })
  }

  return reply.send({ data: subject })
}

export async function createSubject(
  request: FastifyRequest<{ Body: CreateSubjectInput }>,
  reply: FastifyReply
) {
  const subject = await subjectService.create(request.body)
  return reply.status(201).send({ data: subject })
}

export async function updateSubject(
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

export async function deleteSubject(
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
