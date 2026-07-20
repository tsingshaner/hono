import { createMiddleware } from 'hono/factory'

import { initInfrastructure } from '@/infrastructure'

const { config, db, store } = await initInfrastructure()

export type InfraVariables = {
  config: typeof config
  db: typeof db
  store: typeof store
}

export const infra = createMiddleware(async (c, next) => {
  c.set('config', config)
  c.set('db', db)
  c.set('store', store)

  await next()
})
