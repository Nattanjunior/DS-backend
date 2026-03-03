import { z } from 'zod'

const goalDaySchema = z.object({
  weekday: z.number().int().min(1).max(7, 'Dia da semana deve ser entre 1 e 7'),
  hours: z.number().min(0, 'Horas não pode ser negativo'),
  subjectIds: z.array(z.string().uuid('ID de matéria inválido')).optional(),
})

export const createGoalSchema = z.object({
  userId: z.string().uuid('ID de usuário inválido'),
  type: z.enum(['WEEKLY', 'MONTHLY']),
  totalHours: z.number().positive('Horas totais deve ser maior que 0'),
  startDate: z.coerce.date('Data de início inválida'),
  endDate: z.coerce.date('Data de fim inválida'),
  days: z.array(goalDaySchema).min(1, 'Ao menos um dia deve ser informado'),
})

export const updateGoalSchema = z.object({
  type: z.enum(['WEEKLY', 'MONTHLY']).optional(),
  totalHours: z.number().positive('Horas totais deve ser maior que 0').optional(),
  startDate: z.coerce.date('Data de início inválida').optional(),
  endDate: z.coerce.date('Data de fim inválida').optional(),
  days: z.array(goalDaySchema).optional(),
})

export const goalParamsSchema = z.object({
  id: z.string().uuid('ID inválido'),
})

export const goalQuerySchema = z.object({
  userId: z.string().uuid('ID de usuário inválido').optional(),
  type: z.enum(['WEEKLY', 'MONTHLY']).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
})

export type CreateGoalInput = z.infer<typeof createGoalSchema>
export type UpdateGoalInput = z.infer<typeof updateGoalSchema>
export type GoalParams = z.infer<typeof goalParamsSchema>
export type GoalQuery = z.infer<typeof goalQuerySchema>
