import { z } from 'zod'

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

const robustEmailSchema = z.string()
  .min(1, 'Email é obrigatório')
  .refine(
    (email) => emailRegex.test(email),
    'Email inválido. Formato esperado: usuario@dominio.com'
  )

const passwordSchema = z.string()
  .min(6, 'Senha deve ter no mínimo 6 caracteres')
  .max(100, 'Senha deve ter no máximo 100 caracteres')
  .refine(
    (password) => /[A-Z]/.test(password),
    'Senha deve conter pelo menos uma letra maiúscula'
  )
  .refine(
    (password) => /[a-z]/.test(password),
    'Senha deve conter pelo menos uma letra minúscula'
  )
  .refine(
    (password) => /[0-9]/.test(password),
    'Senha deve conter pelo menos um número'
  )

export const registerUserSchema = z.object({
  email: robustEmailSchema,
  password: passwordSchema,
})

export const loginUserSchema = z.object({
  email: robustEmailSchema,
  password: z.string().min(1, 'Senha é obrigatória'),
})

export const forgotPasswordSchema = z.object({
  email: robustEmailSchema,
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token é obrigatório'),
  newPassword: passwordSchema,
})

export const createUserSchema = z.object({
  email: robustEmailSchema.optional(),
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
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type UserParams = z.infer<typeof userParamsSchema>
export type UserQuery = z.infer<typeof userQuerySchema>
