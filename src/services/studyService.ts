import { PrismaClient } from '@prisma/client'
import { Prisma } from '../lib/prisma'
import { CreateStudyInput, UpdateStudyInput, StudyQuery } from '../schemas/studySchema'

export class StudyService {
  constructor(private prisma: PrismaClient) {}

  async findAll(query: StudyQuery) {
    const where: Record<string, unknown> = {}

    if (query.userId) where.userId = query.userId
    if (query.subjectId) where.subjectId = query.subjectId
    if (query.dateFrom || query.dateTo) {
      where.date = {}
      if (query.dateFrom) (where.date as Record<string, Date>).gte = query.dateFrom
      if (query.dateTo) (where.date as Record<string, Date>).lte = query.dateTo
    }

    return this.prisma.study.findMany({
      where,
      include: { subject: true },
      orderBy: { date: 'desc' },
    })
  }

  async findById(id: string) {
    return this.prisma.study.findUnique({
      where: { id },
      include: { subject: true },
    })
  }

  async create(data: CreateStudyInput) {
    return this.prisma.study.create({
      data: {
        userId: data.userId,
        subjectId: data.subjectId,
        hours: data.hours,
        date: data.date,
      },
      include: { subject: true },
    })
  }

  async update(id: string, data: UpdateStudyInput) {
    return this.prisma.study.update({
      where: { id },
      data,
      include: { subject: true },
    })
  }

  async delete(id: string) {
    return this.prisma.study.delete({
      where: { id },
    })
  }
}

export const studyService = new StudyService(Prisma)
