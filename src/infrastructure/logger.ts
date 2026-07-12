import { createWriteStream } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { Writable } from 'node:stream'
import { AsyncLocalStorage } from 'node:async_hooks'

import {
  configure,
  getConsoleSink,
  getJsonLinesFormatter,
  getLogger,
  getStreamSink,
  getAnsiColorFormatter
} from '@logtape/logtape'

import { name } from '../../package.json' with { type: 'json' }

const initLogger = async () => {
  await mkdir('logs', { recursive: true })

  await configure({
    loggers: [
      { category: 'hono', lowestLevel: import.meta.dev ? 'trace' : 'info', sinks: ['console'] },
      { category: name, lowestLevel: 'trace', sinks: ['console'] },
      { category: 'better-auth', lowestLevel: 'debug', sinks: ['console', 'file'] },
      {
        category: ['logtape', 'meta'],
        lowestLevel: 'warning',
        sinks: ['console']
      }
    ],
    contextLocalStorage: new AsyncLocalStorage(),
    sinks: {
      console: getConsoleSink({
        formatter: getAnsiColorFormatter()
      }),
      file: getStreamSink(Writable.toWeb(createWriteStream('logs/better-auth.log', { flags: 'a' })), {
        formatter: getJsonLinesFormatter()
      })
    }
  })
}

await initLogger()

export const getAppLogger = (category?: string) => getLogger(category ? [name, category] : name)
