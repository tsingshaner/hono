import { beforeAll, describe, expect, test, vi } from 'vitest'

import { getConfig } from './config'

describe('config', () => {
  test('should return the config', async () => {
    const config = await getConfig()
    expect(config).toBeDefined()
  })
})
