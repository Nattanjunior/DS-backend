import { FastifyReply, FastifyRequest } from 'fastify'
import { authService } from '../services/authService.js'
import { userService } from '../services/userService.js'
import { RegisterUserInput, LoginUserInput, ForgotPasswordInput, ResetPasswordInput } from '../schemas/userSchema.js'

export async function register(
  request: FastifyRequest<{ Body: RegisterUserInput }>,
  reply: FastifyReply
) {
  try {
    const result = await authService.register(request.body, request.server)
    return reply.status(201).send(result)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao registrar'
    return reply.status(400).send({ error: message })
  }
}

export async function login(
  request: FastifyRequest<{ Body: LoginUserInput }>,
  reply: FastifyReply
) {
  try {
    const result = await authService.login(request.body, request.server)
    return reply.send(result)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao fazer login'
    return reply.status(401).send({ error: message })
  }
}

export async function me(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = request.user.userId

  const user = await userService.findById(userId)

  if (!user) {
    return reply.status(404).send({ error: 'Usuário não encontrado' })
  }

  return reply.send({
    user: {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    },
  })
}

export async function forgotPassword(
  request: FastifyRequest<{ Body: ForgotPasswordInput }>,
  reply: FastifyReply
) {
  try {
    const result = await authService.forgotPassword(request.body)
    return reply.send(result)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao processar solicitação'
    return reply.status(400).send({ error: message })
  }
}

export async function resetPassword(
  request: FastifyRequest<{ Body: ResetPasswordInput }>,
  reply: FastifyReply
) {
  try {
    const result = await authService.resetPassword(request.body)
    return reply.send(result)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao redefinir senha'
    return reply.status(400).send({ error: message })
  }
}
