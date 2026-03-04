import { FastifyInstance } from 'fastify'
import {
  createStudy,
  deleteStudy,
  getStudyById,
  getStudies,
  updateStudy,
} from '../controllers/studyController.js'
import {
  createStudySchema,
  studyParamsSchema,
  studyQuerySchema,
  updateStudySchema,
} from '../schemas/studySchema.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

export async function studyRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authMiddleware)

  app.get(
    '/',
    {
      schema: {
        querystring: studyQuerySchema,
      },
    },
    getStudies
  )

  app.get(
    '/:id',
    {
      schema: {
        params: studyParamsSchema,
      },
    },
    getStudyById
  )

  app.post(
    '/',
    {
      schema: {
        body: createStudySchema,
      },
    },
    createStudy
  )

  app.put(
    '/:id',
    {
      schema: {
        params: studyParamsSchema,
        body: updateStudySchema,
      },
    },
    updateStudy
  )

  app.delete(
    '/:id',
    {
      schema: {
        params: studyParamsSchema,
      },
    },
    deleteStudy
  )
}
