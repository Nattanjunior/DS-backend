import { z } from 'zod'

export const registerUserSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
})

export const loginUserSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
})

export const createUserSchema = z.object({
  email: z.string().email('Email inválido').optional(),
})

export const updateUserSchema = createUserSchema.partial()

export const userParamsSchema = z.object({
  id: z.string().uuid('ID inválido'),
})

export const userQuerySchema = z.object({
  email: z.string().optional(),
  createdAtFrom: z.coerce.date().optional(),
  createdAtTo: z.coerce.date().optional(),
})

export type RegisterUserInput = z.infer<typeof registerUserSchema>
export type LoginUserInput = z.infer<typeof loginUserSchema>
export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type UserParams = z.infer<typeof userParamsSchema>
export type UserQuery = z.infer<typeof userQuerySchema>
