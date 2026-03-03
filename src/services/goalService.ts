import { prisma } from '../lib/prisma.js'
import { CreateGoalInput, UpdateGoalInput, GoalQuery } from '../schemas/goalSchema.js'

export const goalService = {
  async findAll(query: GoalQuery) {
    const where: Record<string, unknown> = {}

    if (query.userId) where.userId = query.userId
    if (query.type) where.type = query.type
    if (query.startDate || query.endDate) {
      where.startDate = {}
      where.endDate = {}
      if (query.startDate) (where.startDate as Record<string, Date>).lte = query.startDate
      if (query.endDate) (where.endDate as Record<string, Date>).gte = query.endDate
    }

    return prisma.goal.findMany({
      where,
      include: {
        days: {
          include: {
            subjects: {
              include: { subject: true },
            },
          },
        },
      },
      orderBy: { startDate: 'desc' },
    })
  },

  async findById(id: string) {
    return prisma.goal.findUnique({
      where: { id },
      include: {
        days: {
          include: {
            subjects: {
              include: { subject: true },
            },
          },
        },
      },
    })
  },

  async create(data: CreateGoalInput) {
    const { userId, type, totalHours, startDate, endDate, days } = data

    return prisma.goal.create({
      data: {
        userId,
        type,
        totalHours,
        startDate,
        endDate,
        days: {
          create: days.map((day) => ({
            weekday: day.weekday,
            hours: day.hours,
            subjects: day.subjectIds
              ? {
                  create: day.subjectIds.map((subjectId) => ({
                    subjectId,
                  })),
                }
              : undefined,
          })),
        },
      },
      include: {
        days: {
          include: {
            subjects: {
              include: { subject: true },
            },
          },
        },
      },
    })
  },

  async update(id: string, data: UpdateGoalInput) {
    const { type, totalHours, startDate, endDate, days } = data

    if (days) {
      await prisma.goalDaySubject.deleteMany({
        where: { goalDay: { goalId: id } },
      })
      await prisma.goalDay.deleteMany({
        where: { goalId: id },
      })
    }

    return prisma.goal.update({
      where: { id },
      data: {
        type,
        totalHours,
        startDate,
        endDate,
        days: days
          ? {
              create: days.map((day) => ({
                weekday: day.weekday,
                hours: day.hours,
                subjects: day.subjectIds
                  ? {
                      create: day.subjectIds.map((subjectId) => ({
                        subjectId,
                      })),
                    }
                  : undefined,
              })),
            }
          : undefined,
      },
      include: {
        days: {
          include: {
            subjects: {
              include: { subject: true },
            },
          },
        },
      },
    })
  },

  async delete(id: string) {
    await prisma.goalDaySubject.deleteMany({
      where: { goalDay: { goalId: id } },
    })
    await prisma.goalDay.deleteMany({
      where: { goalId: id },
    })
    return prisma.goal.delete({
      where: { id },
    })
  },
}
