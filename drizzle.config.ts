import { mkdirSync } from 'node:fs'

import { loadDotenv } from 'c12'
import { defineConfig } from 'drizzle-kit'

const env = await loadDotenv({
  env: process.env,
  fileName: ['.env', '.env.local']
})

type DatabaseConfig =
  | string
  | {
      driver: 'pglite'
      dataDir?: string
    }
  | {
      driver: 'postgres'
      url: string
    }

const getEnv = (key: string) => env[key]?.trim()

const requireEnv = (key: string) => {
  const value = getEnv(key)

  if (!value) {
    throw new Error(`${key} is required`)
  }

  return value
}

const getDatabaseConfig = (): DatabaseConfig => {
  const driver = getEnv('DATABASE_DRIVER')

  if (driver === 'pglite') {
    return {
      dataDir: getEnv('DATABASE_DATA_DIR'),
      driver
    }
  }

  if (driver === 'postgres') {
    return {
      driver,
      url: requireEnv('DATABASE_URL')
    }
  }

  return requireEnv('DATABASE_URL')
}

const database = getDatabaseConfig()

const common = {
  dialect: 'postgresql',
  out: './drizzle',
  schema: './src/infrastructure/db/schema.ts'
} as const

const getPgliteUrl = () => {
  const url =
    typeof database === 'object' && database.driver === 'pglite' ? (database.dataDir ?? '.data/pglite') : '.data/pglite'
  const path = url.startsWith('file:') ? url.slice(5) : url

  if (!path.includes('://')) {
    mkdirSync(path, { recursive: true })
  }

  return url
}

export default defineConfig(
  typeof database === 'object' && database.driver === 'pglite'
    ? {
        ...common,
        dbCredentials: {
          url: getPgliteUrl()
        },
        driver: 'pglite'
      }
    : {
        ...common,
        dbCredentials: {
          url: typeof database === 'string' ? database : database.url
        }
      }
)
