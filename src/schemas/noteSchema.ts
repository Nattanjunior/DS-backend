import { z } from 'zod'

export const createNoteSchema = z.object({
  userId: z.string().uuid('ID de usuário inválido'),
  subjectId: z.string().uuid('ID de matéria inválido').nullable().optional(),
  content: z.string().min(1, 'Conteúdo é obrigatório'),
})

export const updateNoteSchema = createNoteSchema.partial()

export const noteParamsSchema = z.object({
  id: z.string().uuid('ID inválido'),
})

export const noteQuerySchema = z.object({
  userId: z.string().uuid('ID de usuário inválido').optional(),
  subjectId: z.string().uuid('ID de matéria inválido').optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
})

export type CreateNoteInput = z.infer<typeof createNoteSchema>
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>
export type NoteParams = z.infer<typeof noteParamsSchema>
export type NoteQuery = z.infer<typeof noteQuerySchema>
