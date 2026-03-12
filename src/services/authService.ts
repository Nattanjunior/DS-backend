import { FastifyInstance } from 'fastify'
import { Prisma } from '../lib/prisma'
import { userService } from './userService'
import { RegisterUserInput, LoginUserInput, ForgotPasswordInput, ResetPasswordInput } from '../schemas/userSchema'
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

export class AuthService {
  constructor(private prisma: typeof Prisma) {}

  async register(data: RegisterUserInput, fastify: FastifyInstance) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email }
    })
    
    if (existingUser) {
      throw new Error('Email já cadastrado')
    }

    const hashedPassword = await userService.hashPassword(data.password)
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
      },
    })

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
  }

  async login(data: LoginUserInput, fastify: FastifyInstance) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email }
    })
    
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
  }

  async forgotPassword(data: ForgotPasswordInput) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email }
    })
    
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
  }

  async resetPassword(data: ResetPasswordInput) {
    const resetData = passwordResets.get(data.token)

    if (!resetData) {
      throw new Error('Token inválido')
    }

    if (resetData.expiresAt < new Date()) {
      passwordResets.delete(data.token)
      throw new Error('Token expirado')
    }

    const user = await this.prisma.user.findUnique({
      where: { id: resetData.userId }
    })
    
    if (!user) {
      throw new Error('Usuário não encontrado')
    }

    const hashedPassword = await userService.hashPassword(data.newPassword)
    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    })
    passwordResets.delete(data.token)

    return { message: 'Senha atualizada com sucesso' }
  }
}

export const authService = new AuthService(Prisma)
