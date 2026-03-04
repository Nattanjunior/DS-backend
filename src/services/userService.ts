import { prisma } from '../lib/prisma.js'
import { CreateUserInput, UpdateUserInput, UserQuery } from '../schemas/userSchema.js'
import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

export const userService = {
  async findAll(query: UserQuery) {
    const where: Record<string, unknown> = {}

    if (query.email) {
      where.email = { contains: query.email, mode: 'insensitive' }
    }
    if (query.createdAtFrom || query.createdAtTo) {
      where.createdAt = {}
      if (query.createdAtFrom) (where.createdAt as Record<string, Date>).gte = query.createdAtFrom
      if (query.createdAtTo) (where.createdAt as Record<string, Date>).lte = query.createdAtTo
    }

    return prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })
  },

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        subjects: true,
        studies: true,
        goals: true,
        notes: true,
      },
    })
  },

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    })
  },

  async findByEmailWithPassword(email: string) {
    return prisma.user.findUnique({
      where: { email },
    })
  },

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS)
  },

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  },

  async create(data: CreateUserInput) {
    return prisma.user.create({
      data: {
        email: data.email,
      },
    })
  },

  async createWithPassword(email: string, password: string) {
    const hashedPassword = await this.hashPassword(password)
    return prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    })
  },

  async update(id: string, data: UpdateUserInput) {
    return prisma.user.update({
      where: { id },
      data,
    })
  },

  async delete(id: string) {
    return prisma.user.delete({
      where: { id },
    })
  },
}
