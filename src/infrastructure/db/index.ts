import { drizzle as postgresDrizzle } from 'drizzle-orm/node-postgres'
import { drizzle as pgliteDrizzle } from 'drizzle-orm/pglite'
import { migrate } from 'drizzle-orm/pglite/migrator'

import { getConfig } from '../config'
import { relations } from './relation'

type Database =
  | ReturnType<typeof pgliteDrizzle<typeof relations>>
  | ReturnType<typeof postgresDrizzle<typeof relations>>

let $db: Database

const createDatabase = async () => {
  const config = await getConfig()
  const database = config.database

  if (typeof database === 'string') {
    return postgresDrizzle({
      connection: database,
      relations
    })
  }

  if (database.driver === 'postgres') {
    return postgresDrizzle({
      connection: database.url,
      relations
    })
  }

  const db = pgliteDrizzle({
    connection: database.dataDir ? { dataDir: database.dataDir } : {},
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
