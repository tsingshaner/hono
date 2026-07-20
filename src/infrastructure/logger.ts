import { AsyncLocalStorage } from 'node:async_hooks'
import { createWriteStream } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { Writable } from 'node:stream'

import {
  configure,
  getAnsiColorFormatter,
  getConsoleSink,
  getJsonLinesFormatter,
  getLogger,
  getStreamSink
} from '@logtape/logtape'

import { name } from '../../package.json' with { type: 'json' }

export const getAppLoggerCategory = (category?: 'orm' | 'hono' | 'auth' | (string & {})) =>
  category ? [name, category] : name

const initLogger = async () => {
  await mkdir('logs', { recursive: true })

  await configure({
    contextLocalStorage: new AsyncLocalStorage(),
    loggers: [
      { category: getAppLoggerCategory('orm'), lowestLevel: 'trace', sinks: ['console', 'file'] },
      { category: getAppLoggerCategory('hono'), lowestLevel: import.meta.dev ? 'trace' : 'info', sinks: ['console'] },
      { category: getAppLoggerCategory('auth'), lowestLevel: 'debug', sinks: ['console', 'file'] },
      {
        category: ['logtape', 'meta'],
        lowestLevel: 'warning',
        sinks: ['console']
      }
    ],
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

export const getAppLogger = (category?: string) => getLogger(getAppLoggerCategory(category))
