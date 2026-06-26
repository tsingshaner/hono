import { mkdirSync } from 'node:fs'

import { defineConfig } from 'drizzle-kit'

import config from './config'

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

const database = config.database as DatabaseConfig

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
