import { tryGetContext } from 'hono/context-storage'
import { wrapTime as wrapTimeWithContext } from 'hono/timing'

import type { AuthVariables } from './auth'
import type { InfraVariables } from './infra'

export type AppVariables = AuthVariables & InfraVariables

export interface AppEnv {
  Variables: AppVariables
}

// const withAppContext = <T>(handle: (c: Context<AppEnv>) => T) => {
//   const ctx = tryGetContext<AppEnv>()

//   if (!ctx) {
//     return new ServiceException({
//       cause: new Error('App context is not available'),
//       code: 'ERR_APP_CONTEXT_NOT_AVAILABLE',
//       position: 'middlewares::withAppContext',
//       status: 500
//     })
//   }

//   return handle(ctx)
// }

export const wrapTime = <T>(
  name: string,
  callable: Promise<T>,
  description?: string,
  precision?: number
): Promise<T> => {
  const c = tryGetContext()
  return c ? wrapTimeWithContext(c, name, callable, description, precision) : callable
}

export { sessionMiddleware } from './auth'
export { infra } from './infra'
