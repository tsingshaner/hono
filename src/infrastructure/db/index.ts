import { getLogger } from '@logtape/drizzle-orm'
import { drizzle as postgresDrizzle } from 'drizzle-orm/node-postgres'
import { drizzle as pgliteDrizzle } from 'drizzle-orm/pglite'
import { migrate } from 'drizzle-orm/pglite/migrator'

import { getConfig } from '../config'
import { getAppLoggerCategory } from '../logger'
import { relations } from './relation'

type Database =
  | ReturnType<typeof pgliteDrizzle<typeof relations>>
  | ReturnType<typeof postgresDrizzle<typeof relations>>

let $db: Database

const createDatabase = async () => {
  const config = await getConfig()
  const database = config.database

  if (database.driver === 'postgres') {
    return postgresDrizzle({
      connection: database.url,
      relations
    })
  }

  const db = pgliteDrizzle({
    connection: database.dataDir ? { dataDir: database.dataDir } : {},
    logger: getLogger({ category: getAppLoggerCategory('orm') }),
    relations
  })

  await migrate(db, { migrationsFolder: './drizzle' })

  return db
}

export const getDatabase = async () => {
  if (!$db) {
    $db = await createDatabase()
  }

  return $db
}
