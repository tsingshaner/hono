import { Hono } from 'hono'

import type { Context } from 'hono'

import { type AppVariables, validator } from '@/middlewares'

import { createUserSchema, updateUserSchema, userIdSchema } from './schema'
import { createUser, deleteUser, getUser, listUsers, updateUser } from './services'

const requireUser = (c: Context<{ Variables: AppVariables }>) => {
  if (c.get('user')) {
    return null
  }

  return c.json({ error: 'unauthorized' }, 401)
}

export const usersRouter = new Hono<{ Variables: AppVariables }>()
  .use('*', async (c, next) => {
    const response = requireUser(c)

    if (response) {
      return response
    }

    await next()
  })
  .get('/', async (c) => {
    return c.json({ users: await listUsers() })
  })
  .post('/', validator('json', createUserSchema), async (c) => {
    const input = c.req.valid('json')

    if (!input) {
      return c.json({ error: 'invalid body' }, 400)
    }

    return c.json({ user: await createUser(c, input) }, 201)
  })
  .get('/:id', validator('param', userIdSchema), async (c) => {
    const user = await getUser(c.req.valid('param').id)

    return user ? c.json({ user }) : c.json({ error: 'user not found' }, 404)
  })
  .patch('/:id', validator('param', userIdSchema), validator('json', updateUserSchema), async (c) => {
    const params = c.req.valid('param')
    const input = c.req.valid('json')

    const user = await updateUser(params.id, input)

    return user ? c.json({ user }) : c.json({ error: 'user not found' }, 404)
  })
  .delete('/:id', validator('param', userIdSchema), async (c) => {
    const user = await deleteUser(c.req.valid('param').id)

    return user ? c.body(null, 204) : c.json({ error: 'user not found' }, 404)
  })
