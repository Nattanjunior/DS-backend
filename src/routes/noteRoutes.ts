import { FastifyInstance } from 'fastify'
import { noteController } from '../controllers/noteController'
import {
  createNoteSchema,
  noteParamsSchema,
  noteQuerySchema,
  updateNoteSchema,
} from '../schemas/noteSchema'
import { authMiddleware } from '../middleware/authMiddleware'

export async function noteRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authMiddleware)

  app.get(
    '/',
    {
      schema: {
        querystring: noteQuerySchema,
      },
    },
    noteController.getNotes.bind(noteController)
  )

  app.get(
    '/:id',
    {
      schema: {
        params: noteParamsSchema,
      },
    },
    noteController.getNoteById.bind(noteController)
  )

  app.post(
    '/',
    {
      schema: {
        body: createNoteSchema,
      },
    },
    noteController.createNote.bind(noteController)
  )

  app.put(
    '/:id',
    {
      schema: {
        params: noteParamsSchema,
        body: updateNoteSchema,
      },
    },
    noteController.updateNote.bind(noteController)
  )

  app.delete(
    '/:id',
    {
      schema: {
        params: noteParamsSchema,
      },
    },
    noteController.deleteNote.bind(noteController)
  )
}
