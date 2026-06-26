import { configure, getConsoleSink, getJsonLinesFormatter } from '@logtape/logtape'

import { name } from '../../package.json' with { type: 'json' }

export const initLogger = async () => {
  await configure({
    loggers: [
      { category: name, lowestLevel: 'trace', sinks: ['console'] },
      { category: 'better-auth', lowestLevel: 'debug', sinks: ['console'] },
      {
        category: ['logtape', 'meta'],
        lowestLevel: 'warning',
        sinks: ['console']
      }
    ],
    sinks: {
      console: getConsoleSink({
        formatter: getJsonLinesFormatter()
      })
    }
  })
}
