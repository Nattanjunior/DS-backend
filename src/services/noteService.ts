import { prisma } from '../lib/prisma.js'
import { CreateNoteInput, UpdateNoteInput, NoteQuery } from '../schemas/noteSchema.js'

export const noteService = {
  async findAll(query: NoteQuery) {
    const where: Record<string, unknown> = {}

    if (query.userId) where.userId = query.userId
    if (query.subjectId) where.subjectId = query.subjectId
    if (query.dateFrom || query.dateTo) {
      where.createdAt = {}
      if (query.dateFrom) (where.createdAt as Record<string, Date>).gte = query.dateFrom
      if (query.dateTo) (where.createdAt as Record<string, Date>).lte = query.dateTo
    }

    return prisma.note.findMany({
      where,
      include: { subject: true },
      orderBy: { createdAt: 'desc' },
    })
  },

  async findById(id: string) {
    return prisma.note.findUnique({
      where: { id },
      include: { subject: true },
    })
  },

  async create(data: CreateNoteInput) {
    return prisma.note.create({
      data: {
        userId: data.userId,
        subjectId: data.subjectId,
        content: data.content,
      },
      include: { subject: true },
    })
  },

  async update(id: string, data: UpdateNoteInput) {
    return prisma.note.update({
      where: { id },
      data,
      include: { subject: true },
    })
  },

  async delete(id: string) {
    return prisma.note.delete({
      where: { id },
    })
  },
}
