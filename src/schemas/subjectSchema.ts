import { z } from 'zod'

export const createSubjectSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(255),
  userId: z.string().uuid('ID de usuário inválido'),
})

export const updateSubjectSchema = createSubjectSchema.partial()

export const subjectParamsSchema = z.object({
  id: z.string().uuid('ID inválido'),
})

export const subjectQuerySchema = z.object({
  userId: z.string().uuid('ID de usuário inválido').optional(),
  name: z.string().optional(),
})

export type CreateSubjectInput = z.infer<typeof createSubjectSchema>
export type UpdateSubjectInput = z.infer<typeof updateSubjectSchema>
export type SubjectParams = z.infer<typeof subjectParamsSchema>
export type SubjectQuery = z.infer<typeof subjectQuerySchema>
