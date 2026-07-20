import * as v from 'valibot'
import { describe, expect, test } from 'vitest'

import { createUserSchema, updateUserSchema } from './schema'

describe('users schemas', () => {
  test('validates create user input', () => {
    expect(
      v.safeParse(createUserSchema, {
        email: 'user@example.com',
        name: 'User'
      }).success
    ).toBe(true)

    expect(
      v.safeParse(createUserSchema, {
        email: 'bad',
        name: 'User'
      }).success
    ).toBe(false)
  })

  test('allows partial update input', () => {
    expect(v.safeParse(updateUserSchema, { name: 'New Name' }).success).toBe(true)
    expect(v.safeParse(updateUserSchema, { email: 'bad' }).success).toBe(false)
  })
})
