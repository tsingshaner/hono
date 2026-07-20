import { honoLogger } from '@logtape/hono'
import { Hono } from 'hono'
import { contextStorage } from 'hono/context-storage'
import { showRoutes } from 'hono/dev'
import { setMetric, startTime, timing, wrapTime } from 'hono/timing'
import { createRemoteJWKSet, jwtVerify } from 'jose'

import { auth } from './infrastructure/auth'
import { getConfig } from './infrastructure/config'
import { getAppLoggerCategory } from './infrastructure/logger'
import { type AppEnv, infra, sessionMiddleware } from './middlewares'
import { usersRoute } from './routes/users'

const config = await getConfig()
const jwks = createRemoteJWKSet(new URL('/api/auth/jwks', config.baseURL))

const app = new Hono<AppEnv>()
  .use('*', timing({ totalDescription: '' }))
  .use('*', contextStorage())
  .use(
    '*',
    honoLogger({
      category: getAppLoggerCategory('hono'),
      context: true,
      format: (c, responseTime) => {
        const metrics = c.get('metric')
        return {
          method: c.req.method,
          metrics: metrics ? Object.fromEntries(metrics.timers.entries()) : null,
          path: c.req.path,
          requestId: c.req.header('x-request-id') || null,
          responseTime,
          status: c.res.status,
          ua: c.req.header('user-agent') || null,
          url: c.req.url
        }
      },
      level: import.meta.dev ? 'trace' : 'info'
    })
  )
  .use('*', infra)
  .use('*', sessionMiddleware)
  .get('/api/metrics', async (c) => {
    setMetric(c, 'requests')
    setMetric(c, 'uptime', 44)
    startTime(c, 'running')
    await new Promise((resolve) => setTimeout(resolve, 1000))
    await wrapTime(
      c,
      'db',
      (async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000 * Math.random()))
      })()
    )

    return c.json({ metrics: '1' })
  })
  .on(['POST', 'GET'], '/api/auth/*', (c) => auth.handler(c.req.raw))
  .route('/api/users', usersRoute)
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
  .notFound((c) => c.json({ error: 'not found' }, 404))

showRoutes(app)

export default app
export type AppType = typeof app
