import { createWriteStream } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { Writable } from 'node:stream'

import { configure, getConsoleSink, getJsonLinesFormatter, getStreamSink } from '@logtape/logtape'

import { name } from '../../package.json' with { type: 'json' }

export const initLogger = async () => {
  await mkdir('logs', { recursive: true })

  await configure({
    loggers: [
      { category: name, lowestLevel: 'trace', sinks: ['console'] },
      { category: 'better-auth', lowestLevel: 'debug', sinks: ['console', 'file'] },
      {
        category: ['logtape', 'meta'],
        lowestLevel: 'warning',
        sinks: ['console']
      }
    ],
    sinks: {
      console: getConsoleSink({
        formatter: getJsonLinesFormatter()
      }),
      file: getStreamSink(Writable.toWeb(createWriteStream('logs/better-auth.log', { flags: 'a' })), {
        formatter: getJsonLinesFormatter()
      })
    }
  })
}
