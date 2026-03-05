import { FastifyInstance } from 'fastify'
import { userService } from './userService.js'
import { RegisterUserInput, LoginUserInput, ForgotPasswordInput, ResetPasswordInput } from '../schemas/userSchema.js'
import { randomBytes } from 'crypto'

interface AuthPayload {
  userId: string
  email: string
}

interface PasswordResetToken {
  userId: string
  token: string
  expiresAt: Date
}

const passwordResets = new Map<string, PasswordResetToken>()

export const authService = {
  async register(data: RegisterUserInput, fastify: FastifyInstance) {
    const existingUser = await userService.findByEmail(data.email)
    if (existingUser) {
      throw new Error('Email já cadastrado')
    }

    const user = await userService.createWithPassword(data.email, data.password)

    const payload: AuthPayload = {
      userId: user.id,
      email: user.email || '',
    }

    const accessToken = fastify.jwt.sign(payload)

    return {
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
      },
      accessToken,
    }
  },

  async login(data: LoginUserInput, fastify: FastifyInstance) {
    const user = await userService.findByEmailWithPassword(data.email)
    if (!user) {
      throw new Error('Credenciais inválidas')
    }

    if (!user.password) {
      throw new Error('Credenciais inválidas')
    }

    const isValidPassword = await userService.comparePassword(data.password, user.password)
    if (!isValidPassword) {
      throw new Error('Credenciais inválidas')
    }

    const payload: AuthPayload = {
      userId: user.id,
      email: user.email || '',
    }

    const accessToken = fastify.jwt.sign(payload)

    return {
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
      },
      accessToken,
    }
  },

  async forgotPassword(data: ForgotPasswordInput) {
    const user = await userService.findByEmail(data.email)
    
    if (!user) {
      return { message: 'Se o email existir, um link de recuperação será enviado' }
    }

    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000)

    passwordResets.set(token, {
      userId: user.id,
      token,
      expiresAt,
    })

    return { 
      message: 'Se o email existir, um link de recuperação será enviado',
      resetToken: token,
    }
  },

  async resetPassword(data: ResetPasswordInput) {
    const resetData = passwordResets.get(data.token)

    if (!resetData) {
      throw new Error('Token inválido')
    }

    if (resetData.expiresAt < new Date()) {
      passwordResets.delete(data.token)
      throw new Error('Token expirado')
    }

    const user = await userService.findById(resetData.userId)
    if (!user) {
      throw new Error('Usuário não encontrado')
    }

    await userService.updatePassword(user.id, data.newPassword)
    passwordResets.delete(data.token)

    return { message: 'Senha atualizada com sucesso' }
  },
}
