import { prisma } from '../lib/prisma.js'
import { CreateStudyInput, UpdateStudyInput, StudyQuery } from '../schemas/studySchema.js'

export const studyService = {
  async findAll(query: StudyQuery) {
    const where: Record<string, unknown> = {}

    if (query.userId) where.userId = query.userId
    if (query.subjectId) where.subjectId = query.subjectId
    if (query.dateFrom || query.dateTo) {
      where.date = {}
      if (query.dateFrom) (where.date as Record<string, Date>).gte = query.dateFrom
      if (query.dateTo) (where.date as Record<string, Date>).lte = query.dateTo
    }

    return prisma.study.findMany({
      where,
      include: { subject: true },
      orderBy: { date: 'desc' },
    })
  },

  async findById(id: string) {
    return prisma.study.findUnique({
      where: { id },
      include: { subject: true },
    })
  },

  async create(data: CreateStudyInput) {
    return prisma.study.create({
      data: {
        userId: data.userId,
        subjectId: data.subjectId,
        hours: data.hours,
        date: data.date,
      },
      include: { subject: true },
    })
  },

  async update(id: string, data: UpdateStudyInput) {
    return prisma.study.update({
      where: { id },
      data,
      include: { subject: true },
    })
  },

  async delete(id: string) {
    return prisma.study.delete({
      where: { id },
    })
  },
}
