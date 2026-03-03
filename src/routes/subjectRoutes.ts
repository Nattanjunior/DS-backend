import { FastifyInstance } from 'fastify'
import {
  createSubject,
  deleteSubject,
  getSubjectById,
  getSubjects,
  updateSubject,
} from '../controllers/subjectController.js'
import {
  createSubjectSchema,
  subjectParamsSchema,
  subjectQuerySchema,
  updateSubjectSchema,
} from '../schemas/subjectSchema.js'

export async function subjectRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      schema: {
        querystring: subjectQuerySchema,
      },
    },
    getSubjects
  )

  app.get(
    '/:id',
    {
      schema: {
        params: subjectParamsSchema,
      },
    },
    getSubjectById
  )

  app.post(
    '/',
    {
      schema: {
        body: createSubjectSchema,
      },
    },
    createSubject
  )

  app.put(
    '/:id',
    {
      schema: {
        params: subjectParamsSchema,
        body: updateSubjectSchema,
      },
    },
    updateSubject
  )

  app.delete(
    '/:id',
    {
      schema: {
        params: subjectParamsSchema,
      },
    },
    deleteSubject
  )
}
