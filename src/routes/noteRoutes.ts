import { FastifyInstance } from 'fastify'
import {
  createNote,
  deleteNote,
  getNoteById,
  getNotes,
  updateNote,
} from '../controllers/noteController.js'
import {
  createNoteSchema,
  noteParamsSchema,
  noteQuerySchema,
  updateNoteSchema,
} from '../schemas/noteSchema.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

export async function noteRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authMiddleware)

  app.get(
    '/',
    {
      schema: {
        querystring: noteQuerySchema,
      },
    },
    getNotes
  )

  app.get(
    '/:id',
    {
      schema: {
        params: noteParamsSchema,
      },
    },
    getNoteById
  )

  app.post(
    '/',
    {
      schema: {
        body: createNoteSchema,
      },
    },
    createNote
  )

  app.put(
    '/:id',
    {
      schema: {
        params: noteParamsSchema,
        body: updateNoteSchema,
      },
    },
    updateNote
  )

  app.delete(
    '/:id',
    {
      schema: {
        params: noteParamsSchema,
      },
    },
    deleteNote
  )
}
