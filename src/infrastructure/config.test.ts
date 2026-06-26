import { configure, getConsoleSink } from '@logtape/logtape'
import { describe, expect, test } from 'vitest'

import { getConfig } from './config'

void configure({
  loggers: [{ category: 'config', lowestLevel: 'trace', sinks: ['console'] }],
  sinks: { console: getConsoleSink() }
})

describe('config', () => {
  test('should return the config', async () => {
    const config = await getConfig()
    expect(config).toBeDefined()
  })
})
