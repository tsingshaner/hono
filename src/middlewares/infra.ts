import { createMiddleware } from 'hono/factory'

import { initInfrastructure } from '@/infrastructure'

const { config, db } = await initInfrastructure()

export type InfraVariables = {
  config: typeof config
  db: typeof db
}

export const infra = createMiddleware(async (c, next) => {
  c.set('config', config)
  c.set('db', db)

  await next()
})
