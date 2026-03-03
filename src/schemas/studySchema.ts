import { z } from 'zod'

export const createStudySchema = z.object({
  userId: z.string().uuid('ID de usuário inválido'),
  subjectId: z.string().uuid('ID de matéria inválido').nullable().optional(),
  hours: z.number().positive('Horas deve ser maior que 0'),
  date: z.coerce.date('Data inválida'),
})

export const updateStudySchema = createStudySchema.partial()

export const studyParamsSchema = z.object({
  id: z.string().uuid('ID inválido'),
})

export const studyQuerySchema = z.object({
  userId: z.string().uuid('ID de usuário inválido').optional(),
  subjectId: z.string().uuid('ID de matéria inválido').optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
})

export type CreateStudyInput = z.infer<typeof createStudySchema>
export type UpdateStudyInput = z.infer<typeof updateStudySchema>
export type StudyParams = z.infer<typeof studyParamsSchema>
export type StudyQuery = z.infer<typeof studyQuerySchema>
