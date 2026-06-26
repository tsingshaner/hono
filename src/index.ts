import { Hono } from 'hono'
import { createRemoteJWKSet, jwtVerify } from 'jose'

import { initInfrastructure } from './infrastructure'
import { auth } from './infrastructure/auth'
import { getConfig } from './infrastructure/config'
import { sessionMiddleware } from './middlewares/auth'

import type { AuthEnv } from './middlewares/auth'

await initInfrastructure()

const config = await getConfig()
const jwks = createRemoteJWKSet(new URL('/api/auth/jwks', config.baseURL))

const app = new Hono<AuthEnv>()
  .use('*', sessionMiddleware)
  .on(['POST', 'GET'], '/api/auth/*', (c) => {
    return auth.handler(c.req.raw)
  })
  .get('/', (c) => {
    return c.json({})
  })
  .get('/api/me', async (c) => {
    const authorization = c.req.header('authorization')
    const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : undefined

    if (!token) {
      return c.json({ error: 'missing bearer token' }, 401)
    }

    try {
      const { payload } = await jwtVerify(token, jwks, {
        audience: config.baseURL,
        issuer: config.baseURL
      })

      return c.json({ payload })
    } catch {
      return c.json({ error: 'invalid token' }, 401)
    }
  })

export default app
export type AppType = typeof app
