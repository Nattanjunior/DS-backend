import { FastifyInstance } from 'fastify'
import { studyController } from '../controllers/studyController'
import {
  createStudySchema,
  studyParamsSchema,
  studyQuerySchema,
  updateStudySchema,
} from '../schemas/studySchema'
import { authMiddleware } from '../middleware/authMiddleware'

export async function studyRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authMiddleware)

  app.get(
    '/',
    {
      schema: {
        querystring: studyQuerySchema,
      },
    },
    studyController.getStudies.bind(studyController)
  )

  app.get(
    '/:id',
    {
      schema: {
        params: studyParamsSchema,
      },
    },
    studyController.getStudyById.bind(studyController)
  )

  app.post(
    '/',
    {
      schema: {
        body: createStudySchema,
      },
    },
    studyController.createStudy.bind(studyController)
  )

  app.put(
    '/:id',
    {
      schema: {
        params: studyParamsSchema,
        body: updateStudySchema,
      },
    },
    studyController.updateStudy.bind(studyController)
  )

  app.delete(
    '/:id',
    {
      schema: {
        params: studyParamsSchema,
      },
    },
    studyController.deleteStudy.bind(studyController)
  )
}
