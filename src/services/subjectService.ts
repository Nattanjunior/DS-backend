import { PrismaClient } from '@prisma/client'
import { Prisma } from '../lib/prisma'
import { CreateSubjectInput, UpdateSubjectInput } from '../schemas/subjectSchema'

export class SubjectService {
  constructor(private prisma: PrismaClient) {}

  async findAll() {
    return this.prisma.subject.findMany({
      orderBy: { name: 'asc' },
    })
  }

  async findById(id: string) {
    return this.prisma.subject.findUnique({
      where: { id },
    })
  }

  async findByUserId(userId: string) {
    return this.prisma.subject.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
    })
  }

  async create(data: CreateSubjectInput, userId: string) {
    return this.prisma.subject.create({
      data: {
        name: data.name,
        userId: userId,
      },
    })
  }

  async update(id: string, data: UpdateSubjectInput) {
    return this.prisma.subject.update({
      where: { id },
      data,
    })
  }

  async delete(id: string) {
    return this.prisma.subject.delete({
      where: { id },
    })
  }
}

export const subjectService = new SubjectService(Prisma)
