import { drizzle } from 'drizzle-orm/pglite'
import { migrate } from 'drizzle-orm/pglite/migrator'
import { describe, expect, test } from 'vitest'

import { relations } from './relation'
import { users } from './schema'

describe('pglite database', () => {
  test('should run migrations and query with drizzle', async () => {
    const db = drizzle({ relations })

    await migrate(db, { migrationsFolder: './drizzle' })

    const rows = await db.select().from(users)

    expect(rows).toEqual([])
  })
})
