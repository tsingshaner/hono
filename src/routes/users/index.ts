import { validator } from '@qingshaner/utility-hono/middlewares'
import { Hono } from 'hono'

import { requireUser } from '@/middlewares/auth'

import type { AppVariables } from '@/middlewares'

import { createUserSchema, updateUserSchema, userIdSchema } from './schema'
import { createUser, deleteUser, getUser, listUsers, updateUser } from './services'

export const usersRoute = new Hono<{ Variables: AppVariables }>()
  .use(requireUser)
  .get('/', async (c) => c.json({ users: await listUsers() }))
  .post('/', validator('json', createUserSchema), async (c) => {
    const input = c.req.valid('json')

    if (!input) {
      return c.json({ error: 'invalid body' }, 400)
    }

    return c.json({ user: await createUser(c, input) }, 201)
  })
  .get('/:id', validator('param', userIdSchema), async (c) => {
    const user = await getUser(c.var, c.req.valid('param').id)

    return user ? c.json({ user }) : c.json({ error: 'user not found' }, 404)
  })
  .patch('/:id', validator('param', userIdSchema), validator('json', updateUserSchema), async (c) => {
    const params = c.req.valid('param')
    const input = c.req.valid('json')

    const user = await updateUser(c.var, params.id, input)

    return user ? c.json({ user }) : c.json({ error: 'user not found' }, 404)
  })
  .delete('/:id', validator('param', userIdSchema), async (c) => {
    const user = await deleteUser(c.req.valid('param').id)

    return user ? c.body(null, 204) : c.json({ error: 'user not found' }, 404)
  })
