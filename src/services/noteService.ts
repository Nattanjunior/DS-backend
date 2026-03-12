import { PrismaClient } from '@prisma/client'
import { Prisma } from '../lib/prisma'
import { CreateNoteInput, UpdateNoteInput, NoteQuery } from '../schemas/noteSchema'

export class NoteService {
  constructor(private prisma: PrismaClient) {}

  async findAll(query: NoteQuery) {
    const where: Record<string, unknown> = {}

    if (query.userId) where.userId = query.userId
    if (query.subjectId) where.subjectId = query.subjectId
    if (query.dateFrom || query.dateTo) {
      where.createdAt = {}
      if (query.dateFrom) (where.createdAt as Record<string, Date>).gte = query.dateFrom
      if (query.dateTo) (where.createdAt as Record<string, Date>).lte = query.dateTo
    }

    return this.prisma.note.findMany({
      where,
      include: { subject: true },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findById(id: string) {
    return this.prisma.note.findUnique({
      where: { id },
      include: { subject: true },
    })
  }

  async create(data: CreateNoteInput) {
    return this.prisma.note.create({
      data: {
        userId: data.userId,
        subjectId: data.subjectId,
        content: data.content,
      },
      include: { subject: true },
    })
  }

  async update(id: string, data: UpdateNoteInput) {
    return this.prisma.note.update({
      where: { id },
      data,
      include: { subject: true },
    })
  }

  async delete(id: string) {
    return this.prisma.note.delete({
      where: { id },
    })
  }
}

export const noteService = new NoteService(Prisma)
