import { FastifyReply, FastifyRequest } from 'fastify'
import { userService } from '../services/userService.js'
import {
  CreateUserInput,
  UpdateUserInput,
  UserParams,
  UserQuery,
} from '../schemas/userSchema.js'

export async function getUsers(
  request: FastifyRequest<{ Querystring: UserQuery }>,
  reply: FastifyReply
) {
  const users = await userService.findAll(request.query)
  return reply.send({ data: users })
}

export async function getUserById(
  request: FastifyRequest<{ Params: UserParams }>,
  reply: FastifyReply
) {
  const user = await userService.findById(request.params.id)

  if (!user) {
    return reply.status(404).send({ error: 'Usuário não encontrado' })
  }

  return reply.send({ data: user })
}

export async function createUser(
  request: FastifyRequest<{ Body: CreateUserInput }>,
  reply: FastifyReply
) {
  const user = await userService.create(request.body)
  return reply.status(201).send({ data: user })
}

export async function updateUser(
  request: FastifyRequest<{ Params: UserParams; Body: UpdateUserInput }>,
  reply: FastifyReply
) {
  try {
    const user = await userService.update(request.params.id, request.body)
    return reply.send({ data: user })
  } catch {
    return reply.status(404).send({ error: 'Usuário não encontrado' })
  }
}

export async function deleteUser(
  request: FastifyRequest<{ Params: UserParams }>,
  reply: FastifyReply
) {
  try {
    await userService.delete(request.params.id)
    return reply.status(204).send()
  } catch {
    return reply.status(404).send({ error: 'Usuário não encontrado' })
  }
}
