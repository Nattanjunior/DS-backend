import { FastifyReply, FastifyRequest } from 'fastify'
import { noteService } from '../services/noteService.js'
import {
  CreateNoteInput,
  UpdateNoteInput,
  NoteParams,
  NoteQuery,
} from '../schemas/noteSchema.js'

export async function getNotes(
  request: FastifyRequest<{ Querystring: NoteQuery }>,
  reply: FastifyReply
) {
  const notes = await noteService.findAll(request.query)
  return reply.send({ data: notes })
}

export async function getNoteById(
  request: FastifyRequest<{ Params: NoteParams }>,
  reply: FastifyReply
) {
  const note = await noteService.findById(request.params.id)

  if (!note) {
    return reply.status(404).send({ error: 'Nota não encontrada' })
  }

  return reply.send({ data: note })
}

export async function createNote(
  request: FastifyRequest<{ Body: CreateNoteInput }>,
  reply: FastifyReply
) {
  const note = await noteService.create(request.body)
  return reply.status(201).send({ data: note })
}

export async function updateNote(
  request: FastifyRequest<{ Params: NoteParams; Body: UpdateNoteInput }>,
  reply: FastifyReply
) {
  try {
    const note = await noteService.update(request.params.id, request.body)
    return reply.send({ data: note })
  } catch {
    return reply.status(404).send({ error: 'Nota não encontrada' })
  }
}

export async function deleteNote(
  request: FastifyRequest<{ Params: NoteParams }>,
  reply: FastifyReply
) {
  try {
    await noteService.delete(request.params.id)
    return reply.status(204).send()
  } catch {
    return reply.status(404).send({ error: 'Nota não encontrada' })
  }
}
