import { FastifyInstance } from 'fastify'
import { subjectController } from '../controllers/subjectController'
import {
  subjectParamsSchema,
  subjectQuerySchema,
  updateSubjectSchema,
} from '../schemas/subjectSchema'
import { authMiddleware } from '../middleware/authMiddleware'

export async function subjectRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authMiddleware)

  app.get(
    '/',
    {
      schema: {
        querystring: subjectQuerySchema,
      },
    },
    subjectController.getSubjects.bind(subjectController)
  )

  app.get(
    '/:id',
    {
      schema: {
        params: subjectParamsSchema,
      },
    },
    subjectController.getSubjectById.bind(subjectController)
  )

  app.post(
    '/',
    {
      schema: { 
        body: 
        { type: "object", 
          required: ["name"], 
          properties: { 
            name: { type: "string" }
          } 
        } 
      }
    },
    subjectController.createSubject.bind(subjectController)
  )

  app.put(
    '/:id',
    {
      schema: {
        params: subjectParamsSchema,
        body: updateSubjectSchema,
      },
    },
    subjectController.updateSubject.bind(subjectController)
  )

  app.delete(
    '/:id',
    {
      schema: {
        params: subjectParamsSchema,
      },
    },
    subjectController.deleteSubject.bind(subjectController)
  )
}
