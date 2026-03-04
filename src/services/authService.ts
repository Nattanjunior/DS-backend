import { FastifyInstance } from 'fastify'
import { userService } from './userService.js'
import { RegisterUserInput, LoginUserInput } from '../schemas/userSchema.js'

interface AuthPayload {
  userId: string
  email: string
}

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
}
