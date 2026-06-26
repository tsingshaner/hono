import { getLogger } from '@logtape/logtape'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { jwt } from 'better-auth/plugins'

import { getConfig } from './config'
import { getDatabase } from './db'
import * as schema from './db/schema'

// The `jwt` plugin's endpoint types embed a non-portable internal zod type,
// which breaks `.d.ts` emission for this module (better-auth/better-auth#4250).
// We hand-roll the slice of the `auth` instance we actually consume so the
// exported type stays portable.
export interface AuthSession {
  createdAt: Date
  expiresAt: Date
  id: string
  ipAddress?: null | string
  token: string
  updatedAt: Date
  userAgent?: null | string
  userId: string
}

export interface AuthUser {
  createdAt: Date
  email: string
  emailVerified: boolean
  id: string
  image?: null | string
  name: string
  updatedAt: Date
}

interface AppAuth {
  api: {
    getSession: (input: { headers: Headers }) => Promise<{ session: AuthSession; user: AuthUser } | null>
  }
  handler: (request: Request) => Promise<Response>
}

const config = await getConfig()
const logger = getLogger('better-auth')

export const auth = betterAuth({
  baseURL: config.baseURL,
  database: drizzleAdapter(await getDatabase(), {
    debugLogs: true,
    provider: 'pg',
    schema,
    usePlural: true
  }),
  logger: {
    level: 'debug',
    log: (level, message, ...args) => {
      const properties = args.length > 0 ? { args } : undefined

      if (level === 'warn') {
        logger.warn(message, properties)
        return
      }

      logger[level](message, properties)
    }
  },
  plugins: [jwt()],
  secret: config.auth.secret,
  socialProviders: {
    github: {
      clientId: config.auth.github.clientId,
      clientSecret: config.auth.github.clientSecret
    }
  }
}) as unknown as AppAuth
