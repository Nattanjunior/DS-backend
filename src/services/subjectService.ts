import { prisma } from '../lib/prisma.js'
import { CreateSubjectInput, UpdateSubjectInput, SubjectQuery } from '../schemas/subjectSchema.js'

export const subjectService = {
  async findAll(query: SubjectQuery) {
    const where: Record<string, unknown> = {}

    if (query.userId) where.userId = query.userId
    if (query.name) where.name = { contains: query.name, mode: 'insensitive' }

    return prisma.subject.findMany({
      where,
      orderBy: { name: 'asc' },
    })
  },

  async findById(id: string) {
    return prisma.subject.findUnique({
      where: { id },
    })
  },

  async create(data: CreateSubjectInput) {
    return prisma.subject.create({
      data: {
        name: data.name,
        userId: data.userId,
      },
    })
  },

  async update(id: string, data: UpdateSubjectInput) {
    return prisma.subject.update({
      where: { id },
      data,
    })
  },

  async delete(id: string) {
    return prisma.subject.delete({
      where: { id },
    })
  },
}
