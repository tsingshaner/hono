import { eq } from 'drizzle-orm'

import type { Context } from 'hono'

import { getDatabase } from '@/infrastructure/db'
import { users } from '@/infrastructure/db/schema'
import { type AppVariables, wrapTime } from '@/middlewares'

import type { InfraVariables } from '@/middlewares/infra'

import type { CreateUserInput, UpdateUserInput } from './schema'

export const listUsers = async () => {
  const db = await getDatabase()

  return db.select().from(users)
}

export const getUser = async ({ db }: Pick<InfraVariables, 'db'>, id: string) => {
  const [user] = await wrapTime('query-user', db.select().from(users).where(eq(users.id, id)).limit(1))

  return user ?? null
}

export const createUser = async (
  c: Context<{
    Variables: AppVariables
  }>,
  input: CreateUserInput
) => {
  const [user] = await c.var.db
    .insert(users)
    .values({
      ...input,
      id: input.id ?? crypto.randomUUID()
    })
    .returning()

  return user
}

export const updateUser = async ({ db }: Pick<InfraVariables, 'db'>, id: string, input: UpdateUserInput) => {
  const [user] = await wrapTime('update-user', db.update(users).set(input).where(eq(users.id, id)).returning())

  return user ?? null
}

export const deleteUser = async (id: string) => {
  const db = await getDatabase()
  const [user] = await db.delete(users).where(eq(users.id, id)).returning({ id: users.id })

  return user ?? null
}
