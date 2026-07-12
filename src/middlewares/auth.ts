import { createMiddleware } from 'hono/factory'

import { auth } from '../infrastructure/auth'

import type { AuthSession, AuthUser } from '../infrastructure/auth'

export type AuthVariables = {
  session: AuthSession | null
  user: AuthUser | null
}

export const sessionMiddleware = createMiddleware<{
  Variables: AuthVariables
}>(async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers })

  c.set('user', session?.user ?? null)
  c.set('session', session?.session ?? null)

  await next()
})
